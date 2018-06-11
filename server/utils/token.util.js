import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

class Token {
  static sign(data) {
    const token = jwt.sign(data, JWT_SECRET, {
      expiresIn: '10 minutes',
    });
    return token;
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
