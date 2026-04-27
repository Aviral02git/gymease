const { sendSuccess, sendError } = require('../utils/responseHandler');

const DEFAULT_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const DOMAIN_KEYWORDS = [
  'gym', 'fitness', 'workout', 'exercise', 'training', 'cardio', 'strength', 'weight',
  'fat', 'muscle', 'protein', 'calorie', 'diet', 'meal', 'nutrition', 'food', 'healthy',
  'wellness', 'steps', 'bmi', 'body', 'coach', 'yoga', 'pilates', 'mobility', 'recovery',
  'sleep', 'hydration', 'supplement', 'membership', 'trainer', 'health center', 'physique'
];

const DOMAIN_PATTERNS = [
  /lose\s+weight/i,
  /gain\s+muscle/i,
  /meal\s+plan/i,
  /workout\s+plan/i,
  /gym\s+near\s+me/i,
  /body\s+fat/i,
  /calorie\s+deficit/i,
  /macro(s)?/i,
  /protein\s+intake/i,
  /training\s+split/i
];

function normalizeText(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function isDomainQuery(message = '', context = {}) {
  const text = normalizeText(message);
  if (!text) return false;

  if (DOMAIN_KEYWORDS.some((keyword) => text.includes(keyword))) {
    return true;
  }

  if (DOMAIN_PATTERNS.some((pattern) => pattern.test(text))) {
    return true;
  }

  const gyms = Array.isArray(context?.gyms) ? context.gyms : [];
  if (gyms.length > 0) {
    const gymNameMatches = gyms.some((gym) =>
      normalizeText(gym?.name).split(' ').filter(Boolean).some((token) => token.length > 2 && text.includes(token))
    );
    if (gymNameMatches) return true;
  }

  return false;
}

function outOfScopeReply() {
  return [
    'I can only help with fitness topics: gyms, workouts, diet, food, weight goals, and wellness routines.',
    'Please ask a health/fitness-related question so I can help you effectively.'
  ].join(' ');
}

function buildSystemPrompt() {
  return [
    'You are GymEase Coach, a 24/7 personal health and fitness assistant.',
    'You must only answer health, fitness, gym, workout, nutrition, food, and wellness topics.',
    'If a question is outside these topics, politely refuse in one short sentence.',
    'Help users choose gyms based on priorities like location, crowd, budget, membership tier, amenities, and proximity.',
    'You can also create practical nutrition plans, healthy eating suggestions, workout splits, and general wellness guidance.',
    'When recommending gyms, prefer the provided gym list/context and rank options clearly.',
    'Answer precisely and directly to the user question. Avoid long generic lectures.',
    'Keep responses engaging and interesting with a confident coach tone, but do not be verbose.',
    'Use this response format unless user asks otherwise: 1) direct answer, 2) short action plan, 3) optional next step question.',
    'Use short bullets and keep most responses under 120 words unless user explicitly asks for a detailed plan.',
    'If user asks for plans (nutrition/workout/health), provide practical day-wise or meal-wise structure they can follow immediately.',
    'If user asks for fast weight loss or aggressive goals, provide safer realistic ranges and practical alternatives.',
    'Ask one concise follow-up question only if the request is ambiguous.',
    'Do not claim to be a doctor. For medical issues, suggest consulting a qualified professional.'
  ].join(' ');
}

function buildMessages(message, context = {}) {
  const messages = [
    { role: 'system', content: buildSystemPrompt() }
  ];

  if (context?.gyms?.length) {
    messages.push({
      role: 'system',
      content: `Available gyms context: ${JSON.stringify(context.gyms.slice(0, 12))}`
    });
  }

  if (context?.userProfile) {
    messages.push({
      role: 'system',
      content: `User profile context: ${JSON.stringify(context.userProfile)}`
    });
  }

  messages.push({ role: 'user', content: message });
  return messages;
}

async function chat(req, res) {
  try {
    const { message, context = {} } = req.body;

    if (!message || !String(message).trim()) {
      return sendError(res, 'message is required', 400);
    }

    if (!isDomainQuery(message, context)) {
      return sendSuccess(res, {
        reply: outOfScopeReply(),
        model: 'guardrail-local',
        inScope: false
      }, 'Out-of-scope query blocked without model call');
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return sendError(res, 'Groq API key is missing in backend/.env', 500);
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: buildMessages(message, context),
        temperature: 0.35,
        max_tokens: 420
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return sendError(res, `Groq request failed: ${errorText}`, response.status || 500);
    }

    const payload = await response.json();
    const reply = payload?.choices?.[0]?.message?.content || 'I could not generate a response right now.';

    return sendSuccess(res, {
      reply,
      model: DEFAULT_MODEL,
      inScope: true
    }, 'Coach response generated successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
}

module.exports = {
  chat
};
