import React from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-[#111] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700 max-w-md">
        <div className="w-6 h-6 rounded-full bg-[#d9251d] flex items-center justify-center shrink-0">
          <CheckCircle className="w-3.5 h-3.5 text-white" />
        </div>
        <p className="text-xs font-medium leading-snug flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
