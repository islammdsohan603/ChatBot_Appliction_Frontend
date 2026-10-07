import React from "react";
import { HiOutlineExclamationTriangle, HiOutlineArrowPath, HiOutlineHome } from "react-icons/hi2";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-canvas text-fg font-inter">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-surface/90 border border-line-strong shadow-2xl backdrop-blur-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center text-error-text shadow-md">
              <HiOutlineExclamationTriangle className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-fg">
                Something went wrong
              </h2>
              <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                An unexpected interface error occurred. You can reload this view or return to the main dashboard.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-error/5 border border-error/15 text-left">
                <p className="text-[11px] font-mono text-error-text break-words line-clamp-3">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-violet to-brand-indigo text-primary-contrast text-xs font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <HiOutlineArrowPath className="w-4 h-4" />
                <span>Reload</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="py-2.5 px-4 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary-text border border-line-strong text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <HiOutlineHome className="w-4 h-4" />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
