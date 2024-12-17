import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, ChevronDown, BookOpen } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "@/app/components/ui/tooltip";

interface Citation {
  id: number;
  url: string;
  title: string;
}

const CitationReference = ({ citation }: { citation: Citation }) => (
  <Tooltip content={citation.title}>
    <a
      href={citation.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
    >
      <span>[{citation.id}]</span>
    </a>
  </Tooltip>
);

export function LegalModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const citations: Citation[] = [
    {
      id: 1,
      url: "https://www.lib.uchicago.edu/copyrightinfo/fairuse.html",
      title: "University of Chicago Library - Fair Use Guidelines"
    },
    {
      id: 2,
      url: "https://nytlicensing.com/latest/methods/using-copyrighted-material-educational-purposes/",
      title: "NYT Licensing - Educational Use of Copyrighted Material"
    },
    {
      id: 3,
      url: "https://copyrightblog.kluweriplaw.com/2024/02/29/is-generative-ai-fair-use-of-copyright-works-nyt-v-openai/",
      title: "Kluwer Copyright Blog - Generative AI and Fair Use"
    },
    {
      id: 4,
      url: "https://darroweverett.com/new-york-times-vs-open-ai-fair-use-legal-analysis/",
      title: "Darrow Everett LLP - NYT v. OpenAI Analysis"
    }
  ];

  const welcomeContent = {
    title: "Welcome to Axiom, your AI Law Agent",
    description: "Your intelligent assistant for exploring how law is responding to AI and helping you navigate the complex intersection of AI and legal frameworks.",
    capabilities: [
      "Access authoritative sources on AI law and policy",
      "Analyze legal documents and provide insights",
      "Explore complex legal questions through Socratic dialogue",
    ]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] bg-zinc-950 border-zinc-800">
        <DialogTitle className="sr-only">Legal Status</DialogTitle>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-zinc-100 space-y-6"
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-emerald-400">
                Educational Fair Use Status
              </h2>
              
              <div className="space-y-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="font-medium">Educational Purpose</h3>
                    <p className="text-sm text-zinc-400">Developed for Law, Tech, and Culture class</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
                >
                  <Info className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="font-medium">Fair Use Framework</h3>
                    <p className="text-sm text-zinc-400">Compliant with educational fair use guidelines</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
                >
                  <AlertCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="font-medium">Usage Restrictions</h3>
                    <p className="text-sm text-zinc-400">Limited to classroom and educational settings</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <motion.button
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-zinc-900/50 border border-zinc-800 text-emerald-400 hover:text-emerald-300"
                    onClick={() => setIsExpanded(!isExpanded)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Read More</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </motion.button>

                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: isExpanded ? "auto" : 0,
                      opacity: isExpanded ? 1 : 0
                    }}
                    transition={{ 
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100,
                      damping: 20
                    }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={isExpanded ? { y: 0, opacity: 1 } : {}}
                      transition={{ delay: 0.2 }}
                      className="prose prose-sm prose-invert max-w-none p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 space-y-4"
                    >
                      <h3 className="text-lg font-medium text-emerald-400">{welcomeContent.title}</h3>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        {welcomeContent.description}
                      </p>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-emerald-400">Capabilities:</h4>
                        <ul className="space-y-1">
                          {welcomeContent.capabilities.map((capability, index) => (
                            <li key={index} className="text-sm text-zinc-300 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              {capability}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <p className="text-zinc-300 text-sm leading-relaxed">
                        Building Axiom for the Law, Tech, and Culture class final project likely qualifies as fair use due to its educational and transformative nature. Fair use permits limited use of copyrighted material for purposes like teaching, research, and scholarship, especially in nonprofit educational contexts <CitationReference citation={citations[0]} /> <CitationReference citation={citations[1]} />.
                      </p>
                      
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        The project&apos;s transformative purpose—creating new insights or tools rather than replicating the original work—strengthens its fair use argument, similar to precedents like Google Books <CitationReference citation={citations[2]} />. Nevertheless, current cases, such as the New York Times v. OpenAI, reveal how the law is actively negotiating the boundaries of fair use in light of generative AI. <CitationReference citation={citations[3]} />.
                      </p>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4 pt-4 border-t border-zinc-800"
                      >
                        <h4 className="text-sm font-medium text-emerald-400 mb-2">References</h4>
                        <div className="space-y-2">
                          {citations.map((citation) => (
                            <CitationReference key={citation.id} citation={citation} />
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
} 