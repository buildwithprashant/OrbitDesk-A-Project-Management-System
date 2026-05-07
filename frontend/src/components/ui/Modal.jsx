import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/35 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-premium"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-ink">{title}</h2>
          <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
