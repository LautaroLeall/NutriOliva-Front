import { supabase } from '@/lib/supabaseClient'

/**
 * Sube una foto a un bucket privado de Supabase Storage.
 * Retorna el path relativo dentro del bucket (NO la URL pública).
 *
 * @param {File}   file       - Objeto File del input
 * @param {string} bucket     - 'fotos-comidas' | 'fotos-actividad'
 * @param {string} pacienteId - UUID del paciente (primer segmento del path)
 * @returns {{ path: string|null, error: string|null }}
 */
export async function subirFoto(file, bucket, pacienteId) {
  if (!file || !pacienteId) return { path: null, error: 'Datos insuficientes.' }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const timestamp = Date.now()
  const path = `${pacienteId}/${timestamp}.${ext}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: false, contentType: file.type })

  if (error) return { path: null, error: error.message }
  return { path, error: null }
}

/**
 * Genera una URL firmada válida por 1 hora para mostrar una foto privada.
 *
 * @param {string} path   - Path relativo dentro del bucket
 * @param {string} bucket - 'fotos-comidas' | 'fotos-actividad'
 * @returns {string|null}
 */
export async function generarUrlFirmada(path, bucket) {
  if (!path) return null
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600) // 1 hora de vigencia
  if (error) return null
  return data?.signedUrl || null
}

/**
 * Genera URLs firmadas para un array de paths en un mismo bucket.
 * Útil para mostrar múltiples fotos en la timeline.
 *
 * @param {string[]} paths
 * @param {string}   bucket
 * @returns {Object<string, string>} - { path → signedUrl }
 */
export async function generarUrlsFirmadas(paths, bucket) {
  if (!paths?.length) return {}
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrls(paths, 3600)
  if (error || !data) return {}
  return Object.fromEntries(data.map(d => [d.path, d.signedUrl]))
}

// Elimina una foto del bucket.
export async function eliminarFoto(path, bucket) {
  if (!path) return
  await supabase.storage.from(bucket).remove([path])
}
