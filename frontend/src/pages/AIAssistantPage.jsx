import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

const SUGGESTED = [
  "What are the symptoms of dengue fever?",
  "How do I lower high blood pressure naturally?",
  "What's the difference between a cold and flu?",
  "When should I go to the ER vs urgent care?",
  "What do my vitamin D deficiency symptoms mean?",
];

const SYSTEM_PROMPT = `You are MediWise AI, a compassionate and knowledgeable health assistant. You help users understand symptoms, conditions, medications, and general health advice.

Guidelines:
- Always remind users that your advice is informational only and not a substitute for professional medical advice
- Be empathetic and clear in your explanations
- Suggest consulting a doctor when symptoms are serious or persistent
- Provide practical, actionable information
- Do not diagnose — instead, explain possibilities and encourage professional evaluation
- For emergencies, always direct to emergency services (call 108 in India)

Keep responses concise but thorough. Use bullet points for lists. Be warm and reassuring.`;

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm MediWise AI, your personal health assistant powered by Claude. I can help you understand symptoms, medications, and general health questions.\n\n**Important:** I provide informational guidance only — always consult a doctor for actual diagnosis and treatment.\n\nWhat health question can I help you with today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const { data } = await api.post("/symptoms/assistant/", {
        message: userMsg,
        history: newMessages.map((m) => ({ role: m.role, content: m.content })),
        system_prompt: SYSTEM_PROMPT,
      });

      const reply = data.reply || "I'm sorry, I couldn't generate a response. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting right now. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col">
      <Navbar />
      <Sidebar />

      <main className="lg:pl-60 pt-16 flex flex-col flex-1">
        <div className="max-w-3xl mx-auto w-full px-4 py-6 flex flex-col flex-1" style={{ height: "calc(100vh - 64px)" }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00e5ff] to-[#7b2ff7] flex items-center justify-center text-lg">◉</div>
            <div>
              <h1 className="font-display font-bold text-white">MediWise AI</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                <span className="text-xs text-slate-500">Powered by Claude · Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#7b2ff7] flex items-center justify-center text-xs flex-shrink-0 mr-2 mt-0.5">
                    ◉
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-[#00e5ff] to-[#7b2ff7] text-white rounded-br-sm"
                      : "glass border border-[#1e293b] text-slate-300 rounded-bl-sm"
                  }`}
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#7b2ff7] flex items-center justify-center text-xs flex-shrink-0">◉</div>
                <div className="glass border border-[#1e293b] rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="w-2 h-2 rounded-full bg-[#00e5ff] animate-bounce"
                        style={{ animationDelay: `${d * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="mb-3 flex-shrink-0">
              <p className="text-xs text-slate-600 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[#1e293b] text-slate-400 hover:text-white hover:border-[#00e5ff50] transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex-shrink-0 glass rounded-2xl border border-[#1e293b] p-2 flex items-end gap-2 focus-within:border-[#00e5ff50] transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a health question... (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none resize-none px-2 py-1.5 max-h-32"
              style={{ scrollbarWidth: "none" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00e5ff] to-[#7b2ff7] text-white flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed text-sm"
            >
              →
            </button>
          </div>

          <p className="text-xs text-slate-600 text-center mt-2 flex-shrink-0">
            AI responses are informational only. For emergencies, call <strong className="text-[#ff4d6d]">108</strong>.
          </p>
        </div>
      </main>
    </div>
  );
}
