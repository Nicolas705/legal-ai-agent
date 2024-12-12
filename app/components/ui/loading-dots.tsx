'use client';

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function LoadingDots() {
  return (
    <div className="flex items-center space-x-2 p-2">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <MessageCircle className="h-5 w-5 text-primary/50" />
      </motion.div>
      <motion.div className="flex space-x-1">
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            className="h-2 w-2 rounded-full bg-primary/50"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: dot * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
} 