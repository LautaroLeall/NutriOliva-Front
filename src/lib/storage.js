import { supabase } from "@/lib/supabaseClient";

const DEFAULT_MAX_SIDE = 1280;
const DEFAULT_QUALITY = 0.8;
const SKIP_COMPRESSION_BYTES = 300 * 1024; // 300 KB

/**
 * Comprime y redimensiona una fotografia en el navegador antes de subirla a Supabase Storage.
 * Convierte capturas pesadas de camara movil (6 a 15 MB) en JPEG livianos (~180-280 KB)
 * manteniendo nitidez clinica para el nutricionista.
 *
 * @param {File} file
 * @param {{ maxSide?: number, quality?: number }} options
 * @returns {Promise<File>}
 */
export async function comprimirImagenCliente(
  file,
  { maxSide = DEFAULT_MAX_SIDE, quality = DEFAULT_QUALITY } = {}
) {
  if (!file || typeof window === "undefined" || typeof document === "undefined") {
    return file;
  }

  const mime = (file.type || "").toLowerCase();
  if (!mime.startsWith("image/")) {
    return file;
  }

  // Si ya es un JPEG/WebP liviano menor a 300 KB, no recomprimir
  if (
    file.size <= SKIP_COMPRESSION_BYTES &&
    (mime === "image/jpeg" || mime === "image/webp")
  ) {
    return file;
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          resolve(file);
          return;
        }

        if (width > maxSide || height > maxSide) {
          if (width >= height) {
            height = Math.round((height * maxSide) / width);
            width = maxSide;
          } else {
            width = Math.round((width * maxSide) / height);
            height = maxSide;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        // Fondo blanco suave por si la imagen original era PNG con transparencia
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            // Conservar el archivo comprimido si logra reducir peso o normalizar HEIC/PNG grande
            if (blob.size >= file.size && mime === "image/jpeg") {
              resolve(file);
              return;
            }
            const cleanBase =
              (file.name || "foto").replace(/\.[^/.]+$/, "") || "foto";
            const compressedFile = new File([blob], `${cleanBase}.jpg`, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      } catch {
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Sube una foto a un bucket privado de Supabase Storage.
 * Retorna el path relativo dentro del bucket (NO la URL publica).
 *
 * @param {File}   file       - Objeto File del input
 * @param {string} bucket     - 'fotos-comidas' | 'fotos-actividad'
 * @param {string} pacienteId - UUID del paciente (primer segmento del path)
 * @returns {Promise<{ path: string|null, error: string|null }>}
 */
export async function subirFoto(file, bucket, pacienteId) {
  if (!file || !pacienteId) {
    return { path: null, error: "Datos insuficientes." };
  }

  const optimized = await comprimirImagenCliente(file);
  const ext = optimized.name.split(".").pop()?.toLowerCase() || "jpg";
  const timestamp = Date.now();
  const path = `${pacienteId}/${timestamp}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, optimized, {
      upsert: false,
      contentType: optimized.type || "image/jpeg",
    });

  if (error) return { path: null, error: error.message };
  return { path, error: null };
}

/**
 * Genera una URL firmada valida por 1 hora para mostrar una foto privada.
 *
 * @param {string} path   - Path relativo dentro del bucket
 * @param {string} bucket - 'fotos-comidas' | 'fotos-actividad'
 * @returns {Promise<string|null>}
 */
export async function generarUrlFirmada(path, bucket) {
  if (!path) return null;
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600);
  if (error) return null;
  return data?.signedUrl || null;
}

/**
 * Genera URLs firmadas para un array de paths en un mismo bucket.
 * Util para mostrar multiples fotos en la timeline.
 *
 * @param {string[]} paths
 * @param {string}   bucket
 * @returns {Promise<Object<string, string>>}
 */
export async function generarUrlsFirmadas(paths, bucket) {
  if (!paths?.length) return {};
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrls(paths, 3600);
  if (error || !data) return {};
  return Object.fromEntries(data.map((d) => [d.path, d.signedUrl]));
}

// Elimina una foto del bucket.
export async function eliminarFoto(path, bucket) {
  if (!path) return;
  await supabase.storage.from(bucket).remove([path]);
}
