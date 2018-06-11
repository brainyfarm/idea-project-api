import mongoose from 'mongoose';

const Token = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User',
  },
  blacklisted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Token', Token);
