import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function getRecognition() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function normalize(text) {
  return text.toLowerCase().trim();
}

const apiBase = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

export default function AIWaiter({ foodItems = [], foodCategories = [], onSearch, onModeChange }) {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [aiMode, setAiMode] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('Hello. I am AI-WAITER. AI mode is active and connected. Ask me to search food, open cart, or recommend items.');

  const SpeechRecognition = useMemo(() => getRecognition(), []);

  const categoryNames = useMemo(
    () => foodCategories.map((cat) => normalize(cat.CategoryName || '')),
    [foodCategories]
  );

  useEffect(() => {
    if (typeof onModeChange === 'function') {
      onModeChange(aiMode);
    }
  }, [aiMode, onModeChange]);

  const speak = (text) => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const setAssistantReply = (text) => {
    setReply(text);
    speak(text);
  };

  const executeAction = (action, value) => {
    if (action === 'navigate') {
      navigate(value || '/');
      return;
    }

    if (action === 'search') {
      onSearch(value || '');
      navigate('/');
    }
  };

  const runLocalFallback = (rawInput) => {
    const input = normalize(rawInput);

    if (!input) {
      setAssistantReply('I did not catch that. Please try again.');
      return true;
    }

    if (input.includes('open cart') || input.includes('go to cart') || input === 'cart') {
      navigate('/cart');
      setAssistantReply('Opening your cart now.');
      return true;
    }

    if (input.includes('my order') || input.includes('orders')) {
      navigate('/myOrder');
      setAssistantReply('Opening your order history.');
      return true;
    }

    if (input.includes('login') || input.includes('sign in')) {
      navigate('/login');
      setAssistantReply('Opening login page.');
      return true;
    }

    if (input.includes('sign up') || input.includes('register') || input.includes('create account')) {
      navigate('/createuser');
      setAssistantReply('Opening sign up page.');
      return true;
    }

    if (input.includes('clear search') || input.includes('show all')) {
      onSearch('');
      navigate('/');
      setAssistantReply('Search cleared. Showing all menu items.');
      return true;
    }

    const searchMatch = input.match(/(?:search|find|look for)\s+(.+)/);
    if (searchMatch && searchMatch[1]) {
      const term = searchMatch[1].trim();
      onSearch(term);
      navigate('/');
      setAssistantReply(`Searching for ${term}.`);
      return true;
    }

    const foundCategory = categoryNames.find((cat) => cat && input.includes(cat));
    if (foundCategory) {
      onSearch(foundCategory);
      navigate('/');
      setAssistantReply(`Showing ${foundCategory} items.`);
      return true;
    }

    if (input.includes('recommend') || input.includes('suggest')) {
      if (!foodItems.length) {
        setAssistantReply('Menu is still loading. Ask me again in a moment.');
        return true;
      }

      const picks = [...foodItems]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((item) => item.name)
        .join(', ');

      setAssistantReply(`My suggestions are: ${picks}.`);
      return true;
    }

    setAssistantReply('Try commands like search pizza, recommend items, open cart, or show all.');
    return true;
  };

  const callBackendAssistant = async (rawInput) => {
    const input = normalize(rawInput);

    if (!input) {
      setAssistantReply('I did not catch that. Please try again.');
      return;
    }

    try {
      setIsBusy(true);
      const response = await fetch(`${apiBase}/api/ai-waiter/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: input })
      });

      if (!response.ok) {
        throw new Error('Backend returned an error response.');
      }

      const data = await response.json();
      if (data?.mode === 'AI') {
        setAiMode(true);
      }

      if (data?.reply) {
        setAssistantReply(data.reply);
      }

      executeAction(data?.action, data?.searchTerm);
    } catch (_error) {
      setAssistantReply('Backend AI is unavailable. Using local AI-WAITER fallback.');
      runLocalFallback(input);
    } finally {
      setIsBusy(false);
    }
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      setAssistantReply('Voice recognition is not supported on this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      setAssistantReply('Voice capture failed. Please try again.');
    };
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      callBackendAssistant(text);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="ai-waiter-shell" aria-live="polite">
      {isOpen && (
        <div className="ai-waiter-panel">
          <div className="ai-waiter-title">AI-WAITER</div>
          <div className="ai-waiter-text">{reply}</div>
          {transcript ? <div className="ai-waiter-transcript">Heard: {transcript}</div> : null}
          <div className="ai-waiter-actions">
            {!isListening ? (
              <button className="btn btn-success" onClick={startListening} type="button">
                Start Voice
              </button>
            ) : (
              <button className="btn btn-danger" onClick={stopListening} type="button">
                Stop
              </button>
            )}
            <button
              className="btn btn-outline-light"
              onClick={() => callBackendAssistant('recommend')}
              type="button"
            >
              Recommend
            </button>
            <button
              className="btn btn-outline-info"
              onClick={() => setAiMode((prev) => !prev)}
              type="button"
            >
              {aiMode ? 'AI MODE ON' : 'AI MODE OFF'}
            </button>
          </div>
          {isBusy ? <div className="ai-waiter-busy">AI-WAITER is thinking...</div> : null}
          <div className="ai-waiter-help">
            Try: "search burger", "open cart", "show all", "recommend"
          </div>
        </div>
      )}

      <button
        className="ai-waiter-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        AI-WAITER
      </button>
    </div>
  );
}
