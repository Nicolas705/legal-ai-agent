import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SpecsModal({ isOpen, onClose }: SpecsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-white">System Specifications</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-zinc-800"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-zinc-200">
                  <div className="w-24 text-zinc-400">Model</div>
                  <div>Claude 3.5 Sonnet</div>
                </div>
                <div className="flex items-center gap-2 text-zinc-200">
                  <div className="w-24 text-zinc-400">Speed</div>
                  <div>Ultra Fast</div>
                </div>
                <div className="flex items-center gap-2 text-zinc-200">
                  <div className="w-24 text-zinc-400">Memory</div>
                  <div>Infinite</div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 