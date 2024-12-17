'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Send, User, Bot, Paperclip, X, MessageCircle, Sparkles, Scale, Book, Shuffle } from 'lucide-react';
import { LoadingAnimation } from './ui/loading-animation';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
  createdAt?: Date;
  attachment?: {
    name: string;
    content: string;
    type: string;
  };
}

interface PresetQuestion {
  id: string;
  text: string;
  icon: React.ReactNode;
}

const presetQuestions: PresetQuestion[] = [
  {
    id: 'legal-personhood',
    text: "What are the challenges in granting legal personhood to AI?",
    icon: <Scale className="w-4 h-4" />
  },
  {
    id: 'contract-law',
    text: "How is AI reshaping traditional contract law principles?",
    icon: <Book className="w-4 h-4" />
  },
  {
    id: 'liability',
    text: "What frameworks exist for AI liability and accountability?",
    icon: <MessageCircle className="w-4 h-4" />
  }
];

const randomQuestions: PresetQuestion[] = [
  // AI Agency and Legal Personhood
  {
    id: 'agency-1',
    text: "How do we define legal consciousness for AI entities?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'agency-2',
    text: "What rights should autonomous AI systems have under law?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'agency-3',
    text: "Can AI be held criminally liable for its actions?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'agency-4',
    text: "How should we handle AI representation in legal proceedings?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'agency-5',
    text: "What constitutes 'intent' for AI systems in legal contexts?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'agency-6',
    text: "How do fiduciary duties apply to AI agents?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'agency-7',
    text: "Should AI have standing to sue in courts?",
    icon: <Sparkles className="w-4 h-4" />
  },

  // AI and Contract Law
  {
    id: 'contract-1',
    text: "Can AI systems legally form binding contracts?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'contract-2',
    text: "How do smart contracts change traditional contract law?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'contract-3',
    text: "What constitutes breach of contract by an AI system?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'contract-4',
    text: "How should AI-negotiated contracts be enforced?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'contract-5',
    text: "What are the implications of AI contract analysis tools?",
    icon: <Sparkles className="w-4 h-4" />
  },

  // AI and Intellectual Property
  {
    id: 'ip-1',
    text: "Who owns AI-generated intellectual property?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'ip-2',
    text: "How should we handle AI training data copyright issues?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'ip-3',
    text: "Can AI-generated works be patented?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'ip-4',
    text: "What constitutes fair use for AI training?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'ip-5',
    text: "How should trademark law adapt to AI-generated brands?",
    icon: <Sparkles className="w-4 h-4" />
  },

  // AI Liability and Accountability
  {
    id: 'liability-1',
    text: "Who's liable when AI systems cause harm?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'liability-2',
    text: "How should AI malpractice be defined and handled?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'liability-3',
    text: "What insurance frameworks are needed for AI systems?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'liability-4',
    text: "How do we attribute causation in AI-related incidents?",
    icon: <Sparkles className="w-4 h-4" />
  },

  // AI Privacy and Data Protection
  {
    id: 'privacy-1',
    text: "How should AI systems handle personal data rights?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'privacy-2',
    text: "What constitutes informed consent for AI data processing?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'privacy-3',
    text: "How do privacy laws apply to AI training data?",
    icon: <Sparkles className="w-4 h-4" />
  },

  // AI Regulation and Compliance
  {
    id: 'reg-1',
    text: "What regulatory frameworks best govern AI development?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'reg-2',
    text: "How should AI systems be certified for legal compliance?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'reg-3',
    text: "What transparency requirements should apply to AI?",
    icon: <Sparkles className="w-4 h-4" />
  },

  // AI in Legal Practice
  {
    id: 'practice-1',
    text: "How is AI transforming legal research and discovery?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'practice-2',
    text: "What ethical rules should govern AI in law practice?",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'practice-3',
    text: "How should courts handle AI-generated legal arguments?",
    icon: <Sparkles className="w-4 h-4" />
  }
];

const AnimatedTooltip = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-2 bg-zinc-800 
        rounded-lg border border-zinc-700 text-zinc-300 text-sm whitespace-nowrap
        shadow-lg pointer-events-none"
    >
      {children}
      <motion.div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 
          border-b border-r border-zinc-700 rotate-45"
      />
    </motion.div>
  );
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [randomQuestion, setRandomQuestion] = useState<PresetQuestion>(
    randomQuestions[Math.floor(Math.random() * randomQuestions.length)]
  );
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const getInitialMessage = async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [] }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch initial message');
        }

        const data = await response.json();
        setMessages([{
          role: 'assistant',
          content: data.response,
          createdAt: new Date()
        }]);
      } catch (error) {
        console.error('Error fetching initial message:', error);
      }
    };

    if (messages.length === 0) {
      getInitialMessage();
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    let attachment;
    if (selectedFile) {
      const reader = new FileReader();
      const content = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });

      attachment = {
        name: selectedFile.name,
        content,
        type: selectedFile.type,
      };
    }

    const userMessage: Message = {
      role: 'user',
      content: input || 'Uploaded a file: ' + selectedFile?.name,
      createdAt: new Date(),
      attachment,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedFile(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        createdAt: new Date()
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const handlePresetQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();

    const userMessage: Message = {
      role: 'user',
      content: question,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        messages: [...messages, userMessage],
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        throw new Error(data.error);
      }
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        createdAt: new Date()
      }]);
    })
    .catch(error => {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request.' 
      }]);
    })
    .finally(() => {
      setIsLoading(false);
      setInput('');
    });
  };

  const generateRandomQuestion = () => {
    const newQuestion = randomQuestions[Math.floor(Math.random() * randomQuestions.length)];
    setRandomQuestion(newQuestion);
    handlePresetQuestion(newQuestion.text);
  };

  return (
    <Card className="chat-interface min-h-screen border-0 rounded-none bg-zinc-900 shadow-xl flex flex-col">
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6 pb-4 max-w-4xl mx-auto">
          {messages.map((message, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
                delay: i * 0.1 
              }}
              key={i}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <motion.div 
                className="flex items-end max-w-[80%] gap-2"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                {message.role === 'assistant' && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center"
                  >
                    <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                  </motion.div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-zinc-800 rounded-bl-none border border-zinc-700'
                  }`}
                >
                  <div className="prose dark:prose-invert max-w-none break-words">
                    {message.role === 'assistant' ? (
                      <>
                        {message.attachment && (
                          <div className="mb-2">
                            {message.attachment.type.startsWith('image/') ? (
                              <Image 
                                src={message.attachment.content} 
                                alt={message.attachment.name}
                                width={200}
                                height={200}
                                className="max-w-[200px] rounded-lg"
                              />
                            ) : (
                              <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <Paperclip className="w-4 h-4" />
                                {message.attachment.name}
                              </div>
                            )}
                          </div>
                        )}
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            pre: ({ children }) => (
                              <div className="overflow-auto w-full my-2 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100/20 dark:border-indigo-800/20">
                                {children}
                              </div>
                            ),
                            code: ({ inline, children, ...props }) => (
                              inline ? 
                                <code className="bg-indigo-100/50 dark:bg-indigo-900/30 rounded px-1" {...props}>
                                  {children}
                                </code> :
                                <code className="block bg-indigo-100/50 dark:bg-indigo-900/30 p-2 rounded" {...props}>
                                  {children}
                                </code>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </>
                    ) : (
                      message.content
                    )}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === 'user'
                        ? 'text-blue-100/70'
                        : 'text-zinc-400'
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </div>
                </div>
                {message.role === 'user' && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center"
                  >
                    <User className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-end gap-2">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center"
                >
                  <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                </motion.div>
                <div className="rounded-2xl px-4 py-2 shadow-sm bg-zinc-800 rounded-bl-none border border-zinc-700">
                  <LoadingAnimation />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <motion.div 
        className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
          {presetQuestions.map((q) => (
            <motion.button
              key={q.id}
              onClick={() => handlePresetQuestion(q.text)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-sm text-zinc-300 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 15 }}
                className="text-indigo-400"
              >
                {q.icon}
              </motion.span>
              {q.text}
            </motion.button>
          ))}
          
          <motion.button
            onClick={generateRandomQuestion}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-600/20 
              hover:bg-indigo-600/30 border border-indigo-500/30 text-sm text-indigo-300 
              transition-colors relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-indigo-400">
              <Shuffle className="w-4 h-4" />
            </span>
            <span>{randomQuestion.text}</span>
            <AnimatePresence>
              {showTooltip && (
                <AnimatedTooltip>
                  Generate random question
                </AnimatedTooltip>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-zinc-800 flex flex-col gap-2 bg-zinc-900/50"
        autoComplete="off"
      >
        <div className="max-w-4xl mx-auto w-full">
          {/* File Upload Preview */}
          {selectedFile && (
            <div className="flex items-center gap-2 p-2 bg-zinc-800 rounded mb-2">
              <Paperclip className="w-4 h-4 text-zinc-400" />
              <span className="text-sm text-zinc-300">{selectedFile.name}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                }}
                className="ml-auto text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-2 mb-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={isLoading}
              className="border-zinc-700 focus:ring-2 focus:ring-blue-500/20 bg-zinc-800"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <input
              type="file"
              onChange={handleFileSelect}
              className="file-upload hidden"
              id="file-upload"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="shrink-0 border-zinc-700 hover:bg-zinc-800"
              disabled={isLoading}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={isLoading}
              className="shrink-0 bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
} 