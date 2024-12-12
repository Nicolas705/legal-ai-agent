'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Send, User, Bot, Paperclip, X } from 'lucide-react';
import { LoadingDots } from './ui/loading-dots';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

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

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    setFilePreview(null);
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
    <Card className="w-full h-full flex flex-col bg-zinc-900 border-zinc-800/50 shadow-xl">
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
                              <img 
                                src={message.attachment.content} 
                                alt={message.attachment.name}
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
            <div className="flex justify-center">
              <LoadingDots className="text-indigo-600 dark:text-indigo-400" />
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-zinc-800 flex flex-col gap-2 bg-zinc-900/50"
      >
        {selectedFile && (
          <div className="flex items-center gap-2 p-2 bg-zinc-800 rounded">
            <Paperclip className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-300">{selectedFile.name}</span>
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setFilePreview(null);
              }}
              className="ml-auto text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            className="border-zinc-700 focus:ring-2 focus:ring-blue-500/20 bg-zinc-800"
          />
          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
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
      </form>
    </Card>
  );
} 