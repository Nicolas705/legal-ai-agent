'use client';

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className = "" }: LoadingDotsProps) {
  return (
    <div className={`flex space-x-1 ${className}`}>
      <motion.div
        className="w-2 h-2 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 1, 0.4]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0
        }}
      />
      <motion.div
        className="w-2 h-2 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 1, 0.4]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0.2
        }}
      />
      <motion.div
        className="w-2 h-2 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 1, 0.4]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0.4
        }}
      />
    </div>
  );
} 