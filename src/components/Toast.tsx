import * as React from 'react';
import { createContext, useContext, useEffect } from 'react';

interface ToastContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

interface ToastRootProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
}

const ToastRoot = ({ 
  children, 
  open = false, 
  onOpenChange,
  duration = 3000 
}: ToastRootProps) => {
  const [isOpen, setIsOpen] = React.useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (isOpen && duration) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        onOpenChange?.(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onOpenChange]);

  return (
    <ToastContext.Provider value={{ isOpen, setIsOpen }}>
      {isOpen && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-[320px]">
            {children}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

const Title = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
      {children}
    </div>
  );
};

const Description = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {children}
    </div>
  );
};

interface ActionProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Action = ({ children, onClick }: ActionProps) => {
  const context = useContext(ToastContext);

  const handleClick = () => {
    onClick?.();
    context?.setIsOpen(false);
  };

  return (
    <button
      onClick={handleClick}
      className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
    >
      {children}
    </button>
  );
};

export const Toast = {
  Root: ToastRoot,
  Title,
  Description,
  Action,
};