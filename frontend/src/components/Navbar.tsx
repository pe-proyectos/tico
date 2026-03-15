import { Menu, User } from 'lucide-react';

interface NavbarProps {
  onProfileClick: () => void;
  onMenuClick: () => void;
}

export default function Navbar({ onProfileClick, onMenuClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center pointer-events-none">
      <button 
        onClick={onMenuClick} 
        className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-sm pointer-events-auto"
      >
        <Menu className="w-6 h-6 text-gray-800" />
      </button>
      
      <div className="bg-white/80 backdrop-blur-md px-6 py-2 rounded-full shadow-sm font-bold text-xl tracking-tight pointer-events-auto">
        🚕 Tico
      </div>

      <button 
        onClick={onProfileClick} 
        className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-sm pointer-events-auto"
      >
        <User className="w-6 h-6 text-gray-800" />
      </button>
    </nav>
  );
}
