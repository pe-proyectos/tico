import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { Menu, User } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onProfileClick: () => void;
  onMenuClick: () => void;
}

export default function Navbar({ onProfileClick, onMenuClick }: NavbarProps) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 50) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { x: 0, opacity: 1 },
        hidden: { x: "100%", opacity: 0 }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center"
    >
      <button onClick={onMenuClick} className="w-12 h-12 rounded-full glass-panel flex items-center justify-center shadow-sm">
        <Menu className="w-6 h-6 text-tico-black" />
      </button>
      
      <div className="glass-panel px-6 py-2 rounded-full shadow-sm font-bold text-xl tracking-tight">
        Tico
      </div>

      <button onClick={onProfileClick} className="w-12 h-12 rounded-full glass-panel flex items-center justify-center shadow-sm">
        <User className="w-6 h-6 text-tico-black" />
      </button>
    </motion.nav>
  );
}
