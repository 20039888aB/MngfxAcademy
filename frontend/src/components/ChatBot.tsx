import { FormEvent, useEffect, useRef, useState } from 'react';

type Message = {
  from: 'user' | 'bot';
  text: string;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesis = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    synthesis.current = window.speechSynthesis;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  const speak = (text: string) => {
    if (!synthesis.current) return;
    synthesis.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    synthesis.current.speak(utterance);
  };

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { from: 'user', text: trimmed }]);
    setInput('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatbot/query/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      const reply = data.reply ?? 'I am still learning how to answer that.';
      setMessages((prev) => [...prev, { from: 'bot', text: reply }]);
      speak(reply);
    } catch (error) {
      console.error('ChatBot send failed', error);
      const fallback = 'Network issue. Please try again shortly.';
      setMessages((prev) => [...prev, { from: 'bot', text: fallback }]);
      speak(fallback);
    }
  };

  const handleClear = () => {
    setMessages([]);
    synthesis.current?.cancel();
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleSend(input);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <div className="card chat-container">
      <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontWeight: 600 }}>Conversation</span>
        <button
          type="button"
          onClick={handleClear}
          style={{
            border: 'none',
            background: 'rgba(148, 163, 184, 0.2)',
            color: 'inherit',
            padding: '0.35rem 0.75rem',
            borderRadius: '999px',
            cursor: 'pointer',
          }}
        >
          Clear chat
        </button>
      </div>
      <div className="chat-messages">
        {messages.length === 0 && (
          <p style={{ color: '#94a3b8', textAlign: 'center' }}>
            Ask about course content, economic indicators, or trading strategies. Use voice input for hands-free analysis.
          </p>
        )}
        {messages.map((message, index) => (
          <div key={`${message.from}-${index}`} className="chat-message" style={{ textAlign: message.from === 'user' ? 'right' : 'left' }}>
            <div className={`chat-bubble ${message.from}`}>{message.text}</div>
          </div>
        ))}
      </div>
      <form className="input-group" onSubmit={onSubmit}>
        <button type="button" className="btn-primary speak-button" onClick={toggleListening}>
          {listening ? 'Listening…' : 'Speak'}
        </button>
        <input
          type="text"
          placeholder="Type a message or press Speak"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="submit" className="btn-primary" style={{ minWidth: '120px' }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBot;

