const admin = require('firebase-admin');

// Initialise Firebase Admin SDK once (idempotent — safe to call multiple times)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace escaped newlines that can appear when the key is stored in .env
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

/**
 * authMiddleware
 * Verifies a Firebase ID token sent in the Authorization header.
 *
 * On success  → attaches req.user = { uid, email, name, ... } and calls next()
 * On failure  → responds with 401 JSON and stops the request
 *
 * Usage:
 *   router.get('/protected', authMiddleware, handler)
 *   app.use('/api/dashboard', authMiddleware, dashboardRouter)
 */
async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';

  // ── 1. Header format check ─────────────────────────────────────
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header missing or malformed. Expected: Bearer <token>',
    });
  }

  const token = header.replace('Bearer ', '').trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token is empty',
    });
  }

  // ── 2. Verify token with Firebase Admin SDK ────────────────────
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    // decoded contains: uid, email, name, picture, email_verified, iat, exp, ...

    req.user = decoded; // downstream handlers access req.user.uid, req.user.email, etc.
    next();
  } catch (err) {
    // Firebase gives specific error codes — map them to useful messages
    const code = err.code || '';

    if (code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please sign in again.',
      });
    }

    if (code === 'auth/id-token-revoked') {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked. Please sign in again.',
      });
    }

    if (code === 'auth/argument-error' || code === 'auth/invalid-id-token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please sign in again.',
      });
    }

    // Unexpected error — log it server-side, don't expose internals
    console.error('[authMiddleware] Token verification failed:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
}

module.exports = authMiddleware;