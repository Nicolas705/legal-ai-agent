import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Globe, MessageSquareCode, ArrowRight, Scale } from "lucide-react";

interface WelcomeStep {
  title: string;
  description: string;
  icon: JSX.Element;
  bullets: string[];
}

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: WelcomeStep;
  onNext: () => void;
  isLastStep: boolean;
  currentStep: number;
  totalSteps: number;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export function WelcomeModal({
  isOpen,
  onClose,
  step,
  onNext,
  isLastStep,
  currentStep,
  totalSteps
}: WelcomeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-900 text-white border-zinc-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeIn}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader className="space-y-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="p-2 rounded-full bg-indigo-600/20 text-indigo-400"
                >
                  {step.icon}
                </motion.div>
                <DialogTitle className="text-2xl font-semibold">
                  {step.title}
                </DialogTitle>
              </div>
              <DialogDescription className="text-zinc-400 text-lg leading-relaxed">
                {step.description}
              </DialogDescription>
            </DialogHeader>

            <motion.div 
              className="mt-6 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {step.bullets.map((bullet, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2" />
                  <span className="text-zinc-300">{bullet}</span>
                </motion.div>
              ))}
            </motion.div>

            <div className="flex justify-between items-center mt-8">
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-1.5 rounded-full ${
                      i < currentStep ? 'bg-indigo-400' : 'bg-zinc-700'
                    }`}
                    style={{ width: i === currentStep - 1 ? 24 : 12 }}
                    animate={{ 
                      width: i === currentStep - 1 ? 24 : 12,
                      backgroundColor: i < currentStep ? '#818cf8' : '#3f3f46'
                    }}
                  />
                ))}
              </div>
              <Button
                onClick={onNext}
                className="bg-indigo-600 hover:bg-indigo-700 gap-2"
              >
                {isLastStep ? 'Get Started' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
} 