'use client';

import { ChatInterface } from '@/app/components/ChatInterface';
import { Button } from '@/app/components/ui/button';
import { Cpu, Scale, FileText, MessageSquareCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { SpecsModal } from './components/SpecsModal';
import { WelcomeModal } from "./components/WelcomeModal"

export default function Home() {
  const [isHovering, setIsHovering] = useState(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [currentWelcomeStep, setCurrentWelcomeStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);

  const welcomeSteps = [
    {
      title: "Welcome to AI Law Assistant",
      description: "Your intelligent companion for navigating the evolving landscape of AI law and regulation.",
      icon: <Scale className="w-6 h-6" />,
      bullets: [
        "Get expert insights on AI legislation and compliance",
        "Stay updated with the latest regulatory frameworks",
        "Understand legal implications of AI implementation"
      ]
    },
    {
      title: "Document Analysis",
      description: "Upload and analyze legal documents with AI-powered insights.",
      icon: <FileText className="w-6 h-6" />,
      bullets: [
        "Instant analysis of legal documents and contracts",
        "Extract key provisions and requirements",
        "Compare documents against regulatory standards"
      ]
    },
    {
      title: "Interactive Guidance",
      description: "Engage in detailed discussions about AI law and compliance.",
      icon: <MessageSquareCode className="w-6 h-6" />,
      bullets: [
        "Ask questions about specific regulations",
        "Get practical compliance guidance",
        "Explore case studies and precedents"
      ]
    }
  ];

  const handleNextStep = () => {
    if (currentWelcomeStep < welcomeSteps.length - 1) {
      setCurrentWelcomeStep(prev => prev + 1);
    } else {
      setShowWelcome(false);
    }
  };

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
            className="specs-button bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 transition-all duration-200 gap-2"
            onClick={() => setIsSpecsModalOpen(true)}
          >
            <motion.div
              animate={{
                rotate: isHovering ? [0, 360] : 0,
                scale: isSpecsModalOpen ? [1, 1.2, 1] : 1,
              }}
              transition={{
                rotate: {
                  duration: 2,
                  repeat: isHovering ? Infinity : 0,
                  ease: "linear"
                },
                scale: {
                  duration: 0.3,
                  repeat: isSpecsModalOpen ? 0 : 0,
                  ease: "easeInOut"
                }
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
        isOpen={isSpecsModalOpen} 
        onClose={() => setIsSpecsModalOpen(false)} 
      />
      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        step={welcomeSteps[currentWelcomeStep]}
        onNext={handleNextStep}
        isLastStep={currentWelcomeStep === welcomeSteps.length - 1}
        currentStep={currentWelcomeStep + 1}
        totalSteps={welcomeSteps.length}
      />
    </main>
  );
}

