'use client';

import { ChatInterface } from '@/app/components/ChatInterface';
import { Button } from '@/app/components/ui/button';
import { Cpu, Scale, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { SpecsModal } from './components/SpecsModal';
import { WelcomeModal } from "./components/WelcomeModal"
import { LegalModal } from '@/app/components/LegalModal';

export default function Home() {
  const [isHovering, setIsHovering] = useState(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [currentWelcomeStep, setCurrentWelcomeStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);

  const welcomeSteps = [
    {
      title: "Welcome to Axiom, your AI Law Agent",
      description: "Your intelligent assistant for exploring how law is responding to AI and helping you navigate the complex intersection of AI and legal frameworks.",
      icon: <Scale className="w-6 h-6" />,
      bullets: [
        "Access authoritative sources on AI law and policy",
        "Analyze legal documents and provide insights",
        "Explore complex legal questions through Socratic dialogue",
        "Get practical guidance on AI compliance"
      ]
    },
    {
      title: "Fair Use Notice",
      description: "This project is developed for educational purposes as part of the Law, Tech, and Culture class.",
      icon: <FileText className="w-6 h-6" />,
      bullets: [
        "Educational and transformative use in academic context",
        "Built on authoritative legal sources and scholarship",
        "Designed for learning and research purposes",
        "Creates new insights through interactive analysis"
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
          className="fixed top-4 right-4 z-10 flex gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
        >
          <Button
            variant="outline"
            className="legal-button bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 transition-all duration-200 gap-2"
            onClick={() => setIsLegalModalOpen(true)}
          >
            <motion.div
              animate={{
                rotate: isHovering ? [0, 360] : 0,
              }}
              transition={{
                rotate: {
                  duration: 2,
                  repeat: isHovering ? Infinity : 0,
                  ease: "linear"
                },
              }}
            >
              <Scale className="w-4 h-4 text-emerald-400" />
            </motion.div>
            Legal Status
          </Button>
          
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
      <LegalModal 
        isOpen={isLegalModalOpen} 
        onClose={() => setIsLegalModalOpen(false)} 
      />
    </main>
  );
}

