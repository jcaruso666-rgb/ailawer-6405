import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  MessageSquare,
  Send,
  Scale,
  Download,
  Loader2,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Array<{
    name: string;
    type: string;
    data: string;
  }>;
}

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<Array<{
    name: string;
    type: string;
    data: string;
  }>>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const result = event.target?.result as string;
      
      setAttachments((prev) => [
        ...prev,
        {
          name: file.name,
          type: file.type,
          data: result,
        },
      ]);
    };

    if (file.type.startsWith("image/")) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async (text: string) => {
    if ((!text.trim() && attachments.length === 0) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachments([]);
    setIsLoading(true);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      // Build message content with attachments
      let messageContent = text;
      if (userMessage.attachments && userMessage.attachments.length > 0) {
        messageContent += "\n\n[Attachments uploaded:]";
        userMessage.attachments.forEach((att) => {
          if (att.type.startsWith("image/")) {
            messageContent += `\n- Image: ${att.name}`;
          } else {
            messageContent += `\n- Document: ${att.name}\nContent: ${att.data.substring(0, 5000)}`;
          }
        });
      }

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: messageContent }].map((m) => ({
            role: m.role,
            content: typeof m.content === 'string' ? m.content : m.content,
          })),
          model: "gpt-5-nano",
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === "text-delta" && data.delta) {
                  fullText += data.delta;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = fullText;
                    return newMessages;
                  });
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content =
          "Error: Unable to get response. Please try again.";
        return newMessages;
      });
    }

    setIsLoading(false);
  };

  const exportConversation = () => {
    const content = messages
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}\n\n`)
      .join("");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `legal-consultation-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card/50 backdrop-blur-sm p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Scale className="h-6 w-6 text-accent" />
              AI Legal Advisor
            </h1>
            <p className="text-sm text-muted-foreground">
              Get direct, actionable legal advice instantly
            </p>
          </div>
          <div className="flex gap-2">
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={exportConversation}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <Card className="p-8 max-w-2xl text-center">
                <Scale className="h-16 w-16 text-accent mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Start Your Legal Consultation
                </h2>
                <p className="text-muted-foreground mb-6">
                  Ask any legal question and get direct, actionable advice. No
                  disclaimers - just answers.
                </p>
                <div className="grid gap-3">
                  <Button
                    variant="outline"
                    onClick={() =>
                      sendMessage(
                        "Can you help me understand my rights in a landlord-tenant dispute?"
                      )
                    }
                  >
                    Landlord-Tenant Rights
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      sendMessage("How do I file a small claims lawsuit?")
                    }
                  >
                    Filing Small Claims
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      sendMessage(
                        "What are the steps to create a legally binding contract?"
                      )
                    }
                  >
                    Creating Contracts
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6 pb-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Scale className="h-5 w-5 text-accent" />
                    </div>
                  )}
                  <Card
                    className={`p-4 max-w-2xl ${
                      msg.role === "user"
                        ? "bg-accent/10 border-accent/20"
                        : "bg-card"
                    }`}
                  >
                    <div className="text-sm font-semibold text-foreground mb-2">
                      {msg.role === "user" ? "You" : "AI Legal Advisor"}
                    </div>
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {msg.content || (isLoading && msg.role === "assistant" ? "..." : "")}
                    </p>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.attachments.map((att, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground bg-background/50 p-2 rounded">
                            {att.type.startsWith("image/") ? (
                              <>
                                <ImageIcon className="h-4 w-4" />
                                <span>{att.name}</span>
                              </>
                            ) : (
                              <>
                                <FileText className="h-4 w-4" />
                                <span>{att.name}</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                  {msg.role === "user" && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Scale className="h-5 w-5 text-accent" />
                  </div>
                  <Card className="p-4 max-w-2xl bg-card">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Analyzing your legal question...</span>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-border bg-card/30 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="max-w-4xl mx-auto space-y-3"
          >
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded px-3 py-2 text-sm"
                  >
                    {att.type.startsWith("image/") ? (
                      <ImageIcon className="h-4 w-4 text-accent" />
                    ) : (
                      <FileText className="h-4 w-4 text-accent" />
                    )}
                    <span className="text-foreground">{att.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="file"
                id="file-upload"
                accept="image/*,.pdf,.txt,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={isLoading}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask any legal question or upload documents..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="bg-accent text-accent-foreground hover:bg-accent/90 min-w-[100px]"
                disabled={isLoading || (!input.trim() && attachments.length === 0)}
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
