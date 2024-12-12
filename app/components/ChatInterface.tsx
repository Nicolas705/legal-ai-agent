'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Send, User, Bot } from 'lucide-react';
import { LoadingDots } from './ui/loading-dots';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
  createdAt?: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { 
      role: 'user', 
      content: input,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
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

  return (
    <Card className="w-full h-full flex flex-col bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950 dark:to-purple-950 shadow-xl backdrop-blur-sm border-purple-100/20">
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
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
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-none'
                      : 'bg-white dark:bg-zinc-800/70 rounded-bl-none border border-purple-100/20 dark:border-purple-800/20'
                  }`}
                >
                  <div className="prose dark:prose-invert max-w-none break-words">
                    {message.role === 'assistant' ? (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          pre: ({ children }) => (
                            <div className="overflow-auto w-full my-2 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100/20 dark:border-indigo-800/20">
                              {children}
                            </div>
                          ),
                          code: ({ node, inline, className, children, ...props }) => (
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
                    ) : (
                      message.content
                    )}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === 'user'
                        ? 'text-white/70'
                        : 'text-indigo-600/70 dark:text-indigo-300/70'
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
            <div className="flex justify-center">
              <LoadingDots className="text-indigo-600 dark:text-indigo-400" />
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-purple-100/20 dark:border-purple-800/20 flex gap-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm"
      >
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
          className="border-indigo-200 dark:border-indigo-800/30 focus:ring-2 focus:ring-indigo-500/20 bg-white/80 dark:bg-zinc-800/80"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading}
          className="shrink-0 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
} 