"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";

interface Toast {
  id: number;
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning";
  duration?: number;
}

interface ToastContextProps {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: number) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

let toastId = 0;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // runs only in client
  }, []);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = ++toastId;
    const duration = toast.duration || 4000; // default 4 seconds
    
    setToasts((prev) => [...prev, { ...toast, id }]);
    
    // Auto dismiss
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id: number) => {
    // Add exit animation class first
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, isExiting: true } as any : toast
      )
    );
    
    // Remove after animation completes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  };

  const getIcon = (variant?: string) => {
    switch (variant) {
      case "destructive":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case "success":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getToastStyles = (variant?: string, isExiting?: boolean) => {
    const baseStyles = `relative flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm
      text-white transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl
      ${isExiting ? 'animate-slide-out opacity-0 translate-x-full' : 'animate-slide-in'}`;

    switch (variant) {
      case "destructive":
        return `${baseStyles} bg-gradient-to-r from-red-500/90 to-red-600/90 border-red-400/50`;
      case "success":
        return `${baseStyles} bg-gradient-to-r from-green-500/90 to-green-600/90 border-green-400/50`;
      case "warning":
        return `${baseStyles} bg-gradient-to-r from-amber-500/90 to-orange-600/90 border-amber-400/50`;
      default:
        return `${baseStyles} bg-gradient-to-r from-blue-500/90 to-blue-600/90 border-blue-400/50`;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      {mounted &&
        createPortal(
          <>
            <style jsx global>{`
              @keyframes slide-in {
                from {
                  opacity: 0;
                  transform: translateX(100%);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
              
              @keyframes slide-out {
                from {
                  opacity: 1;
                  transform: translateX(0);
                }
                to {
                  opacity: 0;
                  transform: translateX(100%);
                }
              }
              
              .animate-slide-in {
                animation: slide-in 0.3s ease-out;
              }
              
              .animate-slide-out {
                animation: slide-out 0.3s ease-in;
              }
            `}</style>
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
              {toasts.map((toast, index) => (
                <div
                  key={toast.id}
                  className={getToastStyles(toast.variant, (toast as any).isExiting)}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {/* Progress bar */}
                  <div className="absolute top-0 left-0 h-1 bg-white/30 rounded-t-xl animate-pulse"></div>
                  
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(toast.variant)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm leading-tight">
                          {toast.title}
                        </h4>
                        {toast.description && (
                          <p className="text-sm opacity-90 mt-1 leading-relaxed">
                            {toast.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Close button */}
                      <button
                        onClick={() => removeToast(toast.id)}
                        className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label="Close notification"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};