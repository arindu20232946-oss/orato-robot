import { useState, useRef, useEffect } from "react";
import axios from "axios";
import logo from "../assets/logo.png";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface LiveChatProps {
    isOpen: boolean;
    onClose: () => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hi! 👋 I'm Orato's AI assistant. I can help you with questions about Orato and English language learning. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input.trim() };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);

        try {
            // Chat history (excluding system messages)
            const history = messages.slice(1).map((m) => ({
                role: m.role,
                content: m.content,
            }));

            const res = await axios.post(`${window.config.backendUrl}/chat`, {
                message: input.trim(),
                history,
            });

            const aiMessage: Message = {
                role: "assistant",
                content: res.data.reply,
            };
            setMessages([...updatedMessages, aiMessage]);
        } catch (error) {
            setMessages([
                ...updatedMessages,
                {
                    role: "assistant",
                    content: "Sorry, I'm having trouble connecting right now. Please try again later.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 z-40 md:hidden"
                onClick={onClose}
            />

            {/* Chat Widget */}
            <div
                className="fixed bottom-6 right-6 w-[370px] max-w-[calc(100vw-2rem)] h-[520px] 
                   bg-white rounded-3xl shadow-2xl flex flex-col z-50 
                   animate-[slideUp_0.3s_ease-out]"
                style={{
                    boxShadow: "0 20px 60px rgba(26,158,107,0.25), 0 8px 25px rgba(0,0,0,0.12)",
                }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1a9e6b] to-[#14c781] rounded-t-3xl px-5 py-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center overflow-hidden">
                            <img src={logo} alt="AI" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-base leading-tight">Orato AI Assistant</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                                <p className="text-white/80 text-xs">Online – Ask me anything about Orato!</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all text-white font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {msg.role === "assistant" && (
                                <div className="w-7 h-7 bg-white rounded-xl flex items-center justify-center mr-2 flex-shrink-0 mt-1 overflow-hidden shadow-sm">
                                    <img src={logo} alt="AI" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div
                                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                    ? "bg-gradient-to-br from-[#1a9e6b] to-[#14c781] text-white rounded-tr-sm shadow-md"
                                    : "bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isLoading && (
                        <div className="flex justify-start items-end gap-2">
                            <div className="w-7 h-7 bg-white rounded-xl flex items-center justify-center text-sm overflow-hidden shadow-sm">
                                <img src={logo} alt="AI" className="w-full h-full object-cover" />
                            </div>
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
                                <div className="flex gap-1 items-center h-4">
                                    <span className="w-2 h-2 bg-[#1a9e6b] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                    <span className="w-2 h-2 bg-[#1a9e6b] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                    <span className="w-2 h-2 bg-[#1a9e6b] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="px-4 py-3 bg-white border-t border-gray-100 rounded-b-3xl flex-shrink-0">
                    <div className="flex gap-2 items-end">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about Orato or English learning..."
                            rows={1}
                            disabled={isLoading}
                            className="flex-1 resize-none bg-gray-100 rounded-2xl px-4 py-2.5 text-sm text-gray-800 
                         placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#1a9e6b]/30 
                         focus:bg-white transition-all border border-transparent focus:border-[#1a9e6b]/20
                         disabled:opacity-60 max-h-24"
                            style={{ lineHeight: "1.5" }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={isLoading || !input.trim()}
                            className="w-10 h-10 bg-gradient-to-br from-[#1a9e6b] to-[#14c781] rounded-2xl 
                         flex items-center justify-center shadow-md hover:scale-105 
                         active:scale-95 transition-all disabled:opacity-50 disabled:scale-100
                         flex-shrink-0"
                        >
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-center text-gray-400 text-xs mt-2">
                        Press <kbd className="bg-gray-100 px-1 rounded text-xs">Enter</kbd> to send · Only Orato & English learning topics
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </>
    );
};

export default LiveChat;
