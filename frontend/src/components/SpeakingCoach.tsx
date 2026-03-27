import { useEffect, useMemo, useRef, useState } from "react";

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
      const res = await fetch(`${window.config.backendUrl}/speaking-coach/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to get coach reply");
      }

      const assistantText = data.coachReply;
      const assistantMsg: ChatMsg = { role: "assistant", text: assistantText };

      setMessages((prev) => [...prev, assistantMsg]);

      if (autoSpeak && assistantText && assistantText !== lastAssistantSpokenRef.current) {
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

  // Inline mic button: toggle listen/stop
  const toggleMic = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const sendText = () => {
    const t = textInput.trim();
    if (!t || loading) return;
    setTextInput("");
    addUserAndReply(t);
  };

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-4 sm:p-5 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Speaking Practice (AI Coach)</h2>
          <p className="text-gray-600 mt-1">
            Speak in English or type a message. The coach will reply and correct you.
          </p>
          {!supported && (
            <p className="mt-2 text-red-600">
              Speech recognition not supported in this browser. Use typing instead.
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

      {/* Top action buttons (Start / Stop / Clear) — still visible on desktop */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mt-4">
        <button
          onClick={startListening}
          disabled={!supported || listening || loading}
          className={`px-4 py-2 rounded-xl border font-semibold transition-colors duration-200 ${
            listening || loading ? "bg-gray-100 cursor-not-allowed" : "bg-green-50 hover:bg-green-100"
          }`}
        >
          🎤 Start
        </button>

        <button
          onClick={stopListening}
          disabled={!supported || !listening}
          className={`px-4 py-2 rounded-xl border font-semibold transition-colors duration-200 ${
            !listening ? "bg-gray-100 cursor-not-allowed" : "bg-red-50 hover:bg-red-100"
          }`}
        >
          ⏹ Stop
        </button>

        <button
          onClick={() => {
            setMessages((prev) => prev.slice(0, 2));
            setInterim("");
          }}
          className="col-span-2 sm:col-span-1 px-4 py-2 rounded-xl border font-semibold bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
        >
          🧹 Clear Chat
        </button>
      </div>

      {/* Listening / loading indicators */}
      {listening && (
        <div className="mt-3 font-semibold text-green-700">
          Listening… {interim ? `"${interim}"` : ""}
        </div>
      )}
      {loading && (
        <div className="mt-3 text-sm text-blue-600 font-medium flex items-center gap-2">
          <span className="animate-pulse">💭 Coach is thinking...</span>
        </div>
      )}

      {/* Chat area */}
      <div
        ref={chatContainerRef}
        className="mt-4 bg-gray-50 border border-gray-200 rounded-2xl p-3 flex-1 min-h-[18rem] overflow-y-auto"
      >
        {messages
          .filter((m) => m.role !== "system")
          .map((m, idx) => (
            <div
              key={idx}
              className={`flex mb-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[78%] p-3 rounded-2xl border shadow-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-green-100 border-green-200"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="text-xs text-gray-500 mb-1">
                  {m.role === "user" ? "You" : "Coach"}
                </div>
                {m.text}
              </div>
            </div>
          ))}
      </div>

      {/* Input row: [ text input ] [ mic button ] [ send button ] */}
      <div className="flex items-center gap-2 mt-3">
        <input
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type in English…"
          disabled={loading}
          className={`flex-1 px-3 py-2 rounded-xl border border-gray-300 outline-none min-w-0 ${
            loading ? "bg-gray-100 cursor-not-allowed" : "bg-white"
          }`}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendText();
          }}
        />

        {/* Inline mic button — always visible, toggles listening */}
        {supported && (
          <button
            onClick={toggleMic}
            disabled={loading}
            title={listening ? "Stop listening" : "Speak"}
            className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200 ${
              loading
                ? "bg-gray-100 cursor-not-allowed text-gray-400"
                : listening
                ? "bg-red-100 border-red-300 text-red-600 animate-pulse hover:bg-red-200"
                : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            }`}
          >
            {listening ? (
              /* Stop / waveform icon when active */
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              /* Microphone icon when idle */
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-1 17.93V21H9v2h6v-2h-2v-2.07A8.001 8.001 0 0 0 20 11h-2a6 6 0 0 1-12 0H4a8.001 8.001 0 0 0 7 7.93z" />
              </svg>
            )}
          </button>
        )}

        <button
          onClick={sendText}
          disabled={loading}
          className={`flex-shrink-0 px-4 py-2 rounded-xl border font-bold transition-colors duration-200 ${
            loading ? "bg-gray-100 cursor-not-allowed" : "bg-green-50 hover:bg-green-100"
          }`}
        >
          Send
        </button>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Note: Speech feature works best in Chrome/Edge. Tap the mic icon to speak directly.
      </p>
    </div>
  );
}

export default SpeakingCoach;