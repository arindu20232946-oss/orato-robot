import  { useEffect, useMemo, useRef, useState } from "react";

type ChatMsg = {
  role: "user" | "assistant" | "system";
  text: string;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

/**
 * Initializes the browser's native Web Speech API.
 * Returns null if the browser does not support it (e.g., non-Chrome/Edge browsers).
 */
function getRecognition(): any | null {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;

  const rec = new SR();
  rec.continuous = false;
  rec.interimResults = true;
  rec.lang = "en-US";
  return rec;
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 1;
  u.pitch = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

/**
 * SpeakingCoach Component
 * Provide an interactive chat interface for users to converse with an AI english speaking coach.
 * Supports native Web Speech API listening for browsers that support it, with a graceful text fallback.
 */
function SpeakingCoach() {
  const recognition = useMemo(() => getRecognition(), []);
  const [supported, setSupported] = useState(true);

  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "system",
      text: "You are an English speaking coach. Keep answers short and friendly. Ask follow-up questions.",
    },
    {
      role: "assistant",
      text: "Hi! Click Start and speak in English. I will reply and help you improve.",
    },
  ]);

  const [autoSpeak, setAutoSpeak] = useState(true);
  const lastAssistantSpokenRef = useRef<string>("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!recognition) setSupported(false);
  }, [recognition]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addUserAndReply = async (userText: string) => {
    const userMsg: ChatMsg = { role: "user", text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5002/api/speaking-coach/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to get coach reply");
      }

      const assistantText = data.coachReply;
      const assistantMsg: ChatMsg = { role: "assistant", text: assistantText };

      setMessages((prev) => [...prev, assistantMsg]);

      if (
        autoSpeak &&
        assistantText &&
        assistantText !== lastAssistantSpokenRef.current
      ) {
        lastAssistantSpokenRef.current = assistantText;
        speak(assistantText);
      }
    } catch (error) {
      const errorMsg: ChatMsg = {
        role: "assistant",
        text: "Sorry, I could not connect to the AI coach server.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (!recognition) return;

    setInterim("");
    setListening(true);

    recognition.onresult = (event: any) => {
      let full = "";
      let inter = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) full += transcript;
        else inter += transcript;
      }

      if (inter) setInterim(inter);

      if (full) {
        setInterim("");
        setListening(false);
        addUserAndReply(full);
      }
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
  };

  const stopListening = () => {
    try {
      recognition?.stop();
    } catch (err) {
      console.warn("Speech recognition stop error:", err);
    }
    setListening(false);
  };

  const sendText = () => {
    const t = textInput.trim();
    if (!t || loading) return;
    setTextInput("");
    addUserAndReply(t);
  };

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Speaking Practice (AI Coach)</h2>
          <p className="text-gray-600 mt-1">
            Speak in English or type a message. The coach will reply and correct
            you.
          </p>

          {!supported && (
            <p className="mt-2 text-red-600">
              Speech recognition not supported in this browser. Use typing
              instead.
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 select-none">
          <input
            type="checkbox"
            checked={autoSpeak}
            onChange={(e) => setAutoSpeak(e.target.checked)}
          />
          Auto Speak
        </label>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={startListening}
          disabled={!supported || listening || loading}
          className={`px-4 py-2 rounded-xl border font-semibold transition-colors duration-200 ${listening || loading
            ? "bg-gray-100 cursor-not-allowed"
            : "bg-green-50 hover:bg-green-100"
            }`}
        >
          🎤 Start
        </button>

        <button
          onClick={stopListening}
          disabled={!supported || !listening}
          className={`px-4 py-2 rounded-xl border font-semibold transition-colors duration-200 ${!listening
            ? "bg-gray-100 cursor-not-allowed"
            : "bg-red-50 hover:bg-red-100"
            }`}
        >
          ⏹ Stop
        </button>

        <button
          onClick={() => {
            setMessages((prev) => prev.slice(0, 2));
            setInterim("");
          }}
          className="px-4 py-2 rounded-xl border font-semibold bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
        >
          🧹 Clear Chat
        </button>
      </div>

      {listening && (
        <div className="mt-3 font-semibold text-green-700">
          Listening… {interim ? `“${interim}”` : ""}
        </div>
      )}

      {loading && (
        <div className="mt-3 text-sm text-blue-600 font-medium flex items-center gap-2">
          <span className="animate-pulse">💭 Coach is thinking...</span>
        </div>
      )}

      <div
        ref={chatContainerRef}
        className="mt-4 bg-gray-50 border border-gray-200 rounded-2xl p-3 h-72 overflow-y-auto"
      >
        {messages
          .filter((m) => m.role !== "system")
          .map((m, idx) => (
            <div
              key={idx}
              className={`flex mb-3 ${m.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div className="max-w-[78%] p-3 rounded-2xl bg-white border border-gray-100 shadow-sm whitespace-pre-wrap">
                <div className="text-xs text-gray-500 mb-1">
                  {m.role === "user" ? "You" : "Coach"}
                </div>
                {m.text}
              </div>
            </div>
          ))}
      </div>

      <div className="flex gap-2 mt-3">
        <input
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type in English…"
          disabled={loading}
          className={`flex-1 px-3 py-2 rounded-xl border border-gray-300 outline-none ${loading ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendText();
          }}
        />
        <button
          onClick={sendText}
          disabled={loading}
          className={`px-4 py-2 rounded-xl border font-bold transition-colors duration-200 ${loading
            ? "bg-gray-100 cursor-not-allowed"
            : "bg-green-50 hover:bg-green-100"
            }`}
        >
          Send
        </button>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Note: Speech feature works best in Chrome/Edge. Coach replies come from
        the backend API.
      </p>
    </div>
  );
}

export default SpeakingCoach;