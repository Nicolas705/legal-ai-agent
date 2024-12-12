import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, MessageSquare, FileText } from "lucide-react";

export function SpecsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-zinc-100 space-y-6"
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-indigo-400">
                System Specifications
              </h2>
              
              <div className="space-y-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
                >
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="font-medium">Chat Model</h3>
                    <p className="text-sm text-zinc-400">Mixtral 8x7B via Groq</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
                >
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="font-medium">Embeddings Model</h3>
                    <p className="text-sm text-zinc-400">OpenAI text-embedding-3-small</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
                >
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="font-medium">Processing</h3>
                    <p className="text-sm text-zinc-400">Real-time inference</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
} 