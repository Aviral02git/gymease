function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const token = header.replace('Bearer ', '').trim();

  if (!token) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  req.user = { token };
  next();
}

module.exports = authMiddleware;
