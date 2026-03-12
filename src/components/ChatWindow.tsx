import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { getAIResponse, QUICK_PROMPTS, type DatasetAnalysis } from "@/services/mockAI";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  datasetContext?: DatasetAnalysis | null;
}

export function ChatWindow({ datasetContext }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm **GreenWatts AI** 🌱 — your energy conservation advisor.\n\nI can analyze your energy patterns, suggest savings strategies, and help reduce your carbon footprint.\n\nTry asking me something like:\n- \"What's my biggest energy waste?\"\n- \"How can I reduce AC usage?\"\n- \"Predict my monthly bill\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const msg = (text || input).trim();
      if (!msg || loading) return;
      setInput("");
      setMessages((prev) => [...prev, { role: "user", content: msg }]);
      setLoading(true);
      try {
        const reply = await getAIResponse(msg, datasetContext || undefined);
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
        ]);
      }
      setLoading(false);
    },
    [input, loading, datasetContext]
  );

  // Simple markdown-ish rendering
  function renderContent(text: string) {
    return text.split("\n").map((line, i) => {
      let rendered = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 rounded bg-muted text-xs font-mono">$1</code>');
      if (line.startsWith("## ")) rendered = `<span class="text-base font-bold block mt-1">${rendered.slice(5)}</span>`;
      else if (line.startsWith("- ")) rendered = `<span class="block pl-3">• ${rendered.slice(2)}</span>`;
      return (
        <span key={i} className="block" dangerouslySetInnerHTML={{ __html: rendered || "&nbsp;" }} />
      );
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Quick prompts */}
      <div className="flex flex-wrap gap-2 mb-3">
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-all"
          >
            {q}
          </button>
        ))}
        {datasetContext && (
          <button
            onClick={() => sendMessage("Analyze my uploaded dataset")}
            className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-primary hover:bg-primary/20 transition-all font-medium"
          >
            🔍 Analyze uploaded data
          </button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 rounded-t-xl border border-border bg-card/50 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
              >
                {m.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-secondary-foreground rounded-bl-sm"
                  )}
                >
                  {renderContent(m.content)}
                </div>
                {m.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Analyzing...</span>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="flex gap-0 border border-t-0 border-border rounded-b-xl overflow-hidden bg-card">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask GreenWatts AI about your energy..."
          className="flex-1 border-0 rounded-none focus-visible:ring-0 bg-transparent h-12"
        />
        <Button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="rounded-none h-12 px-5"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
