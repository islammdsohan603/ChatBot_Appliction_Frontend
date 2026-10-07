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
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-[#060918] text-slate-800 dark:text-slate-100 font-inter">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#0a0f2a]/95 border border-violet-500/20 shadow-2xl backdrop-blur-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-md">
              <HiOutlineExclamationTriangle className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Something went wrong
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                An unexpected interface error occurred. You can reload this view or return to the main dashboard.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-red-500/5 dark:bg-red-950/20 border border-red-500/15 text-left">
                <p className="text-[11px] font-mono text-red-600 dark:text-red-400 break-words line-clamp-3">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <HiOutlineArrowPath className="w-4 h-4" />
                <span>Reload</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="py-2.5 px-4 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-500/20 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
