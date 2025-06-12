import React from 'react';
import { Plus } from 'lucide-react';

interface AddProjectButtonProps {
  onClick: () => void;
}

export function AddProjectButton({ onClick }: AddProjectButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 rounded-full shadow-2xl hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 transition-all hover:shadow-emerald-500/25 hover:scale-110 z-40 backdrop-blur-sm border border-white/20"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}