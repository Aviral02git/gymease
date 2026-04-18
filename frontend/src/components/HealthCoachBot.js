import React, { useMemo, useState } from 'react';
import coachService from '../services/coachService';
import { GYMS_DATA } from '../data/gymsData';

const QUICK_PROMPTS = [
  'Recommend gyms near me based on low crowd and good location.',
  'Build a weight loss nutrition plan for me.',
  'Create a beginner workout split for 5 days a week.',
  'Give me a healthy Indian meal plan for fat loss.',
  'Help me choose between Lite, Prime, and Platinum gym plans.',
  'Make me a 24x7 fitness coach plan for better energy and recovery.'
];

const initialMessages = [
  {
    role: 'assistant',
    content:
      'Hi, I am your GymEase Coach. I can help you choose gyms by location, crowd, budget, and plan tier, or build nutrition and fitness plans for you.'
  }
];

const HealthCoachBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasUserStartedChat = messages.some((msg) => msg.role === 'user');

  const gymContext = useMemo(
    () =>
      GYMS_DATA.map((gym) => ({
        id: gym.id,
        name: gym.name,
        location: gym.location,
        city: gym.city,
        tier: gym.tier,
        monthlyPrice: gym.monthlyPrice,
        rating: gym.rating,
        reviews: gym.reviews,
        viewsPerMonth: gym.viewsPerMonth,
        peakOccupancy: gym.peakOccupancy,
        tags: gym.tags
      })),
    []
  );

  const sendMessage = async (messageText) => {
    const message = String(messageText || input).trim();
    if (!message) return;

    setError('');
    setLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setInput('');

    try {
      const response = await coachService.sendMessage(message, {
        gyms: gymContext,
        userProfile: {
          locale: 'India',
          availablePlanTypes: ['Lite', 'Prime', 'Platinum']
        }
      });

      setMessages((prev) => [...prev, { role: 'assistant', content: response?.reply || 'I could not generate a response.' }]);
    } catch (err) {
      setError(err.message || 'Coach is unavailable right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-primary px-5 py-3 text-white font-black shadow-[0_12px_30px_rgba(244,63,94,0.4)] hover:brightness-110 transition-all"
      >
        {isOpen ? 'Close Coach' : 'AI Coach'}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 w-[min(92vw,420px)] rounded-3xl border border-white/10 bg-background/95 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.55)] overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-white">GymEase Coach</p>
              <p className="text-xs text-textMuted">24x7 gym, nutrition and fitness assistant</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-textMuted hover:text-white" type="button">
              ✕
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'ml-auto bg-primary text-white'
                    : 'mr-auto bg-surface text-textMain border border-white/5'
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && <div className="text-xs text-textMuted px-2">Coach is thinking...</div>}
            {error && <div className="text-xs text-red-400 px-2">{error}</div>}
          </div>

          <div className="border-t border-white/10 px-4 py-4 space-y-3">
            {!hasUserStartedChat && (
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-widest text-textMuted font-bold">Quick start</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-textMuted hover:text-white hover:border-primary transition-colors"
                    >
                      {prompt.length > 32 ? `${prompt.slice(0, 32)}...` : prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(input);
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask for gym recommendations, meal plans, workouts..."
                className="input-field flex-1"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-primary px-4 py-3 text-sm font-black uppercase tracking-wider text-white disabled:opacity-60"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default HealthCoachBot;
