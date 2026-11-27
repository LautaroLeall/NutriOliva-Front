// src/components/ui/ErrorBoundary.jsx
// Captura errores inesperados de renderizado en cualquier vista para evitar pantallas en blanco.

import { Component } from "react";
import Logo from "@/components/ui/Logo";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Error inesperado en la aplicacion.",
    };
  }

  componentDidCatch(error, info) {
    console.error("[NutriOliva ErrorBoundary]", error, info?.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, message: "" });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#EFEAE0] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-cream-darker rounded-2xl p-6 shadow-card text-center space-y-4">
            <div className="flex justify-center">
              <Logo size={36} />
            </div>
            <h1 className="font-display font-bold text-lg text-olive-dark">
              Ocurrio un inconveniente temporal
            </h1>
            <p className="text-xs font-body text-muted leading-relaxed">
              Recarga la pagina para continuar trabajando con normalidad. Tus
              datos guardados estan seguros.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="w-full py-2.5 px-4 rounded-xl bg-olive text-cream font-display font-semibold text-xs hover:bg-olive-deep transition-colors cursor-pointer"
            >
              Recargar aplicacion
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
