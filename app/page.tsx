'use client';

import { ChatInterface } from '@/app/components/ChatInterface';
import { Button } from '@/app/components/ui/button';
import { Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { SpecsModal } from './components/SpecsModal';

export default function Home() {
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="flex min-h-screen flex-col bg-black w-full">
      <div className="flex-1 relative">
        <motion.div
          className="fixed top-4 right-4 z-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
        >
          <Button
            variant="outline"
            className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 transition-all duration-200 gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <motion.div
              animate={{
                rotate: isHovering ? [0, 360] : 0,
              }}
              transition={{
                duration: 2,
                repeat: isHovering ? Infinity : 0,
                ease: "linear"
              }}
            >
              <Cpu className="w-4 h-4 text-indigo-400" />
            </motion.div>
            Specs
          </Button>
        </motion.div>
        <ChatInterface />
      </div>
      <SpecsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}

