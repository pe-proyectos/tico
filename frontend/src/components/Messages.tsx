import { motion } from 'motion/react';
import { ArrowLeft, Search } from 'lucide-react';

export default function Messages({ onBack }: { onBack: () => void }) {
  const chats = [
    { id: 1, name: 'Soporte Tico', msg: 'Tu reporte ha sido resuelto.', time: '10:30', unread: 0 },
    { id: 2, name: 'Carlos M. (Conductor)', msg: 'Estoy en la puerta.', time: 'Ayer', unread: 2 },
  ];

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto"
    >
      <div className="bg-white pt-12 pb-4 px-6 shadow-sm sticky top-0 z-10 flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ArrowLeft className="w-6 h-6 text-tico-black" />
        </button>
        <h1 className="text-2xl font-bold text-tico-black">Mensajes</h1>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-2xl p-3 flex items-center gap-3 mb-6 shadow-sm border border-gray-100">
          <Search className="w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Buscar mensajes..." className="bg-transparent outline-none flex-1 text-tico-black" />
        </div>

        <div className="space-y-3">
          {chats.map(chat => (
            <div key={chat.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 active:scale-95 transition-transform cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0">
                <img src={`https://picsum.photos/seed/${chat.name}/100/100`} alt={chat.name} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-tico-black truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500 font-medium">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.msg}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-6 h-6 rounded-full bg-tico-yellow flex items-center justify-center text-xs font-bold text-tico-black">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
