import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

class Token {
  static sign(payload) {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '10 minutes',
    });
  }
  static decode(token) {
    try {
      return jwt.decode(token, JWT_SECRET);
    } catch(error) {
      return 'Invalid token';
    }
  }
}

export default Token;
