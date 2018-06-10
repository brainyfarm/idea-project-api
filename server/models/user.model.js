import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const User = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, 'provide an email address'],
    unique: [true, 'a user with that email exists'],
    validate: {
      validator: value => 
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(value),
      message: 'invalid email address',
    },
  },
  name: {
    type: String,
    trim: true,
    min: [2, 'name too short'],
    max: [60, 'name too long'],
    required: [true, 'please provide a name'], 
  },
  password: {
    type: String,
    required: [true, 'password field cannot be empty'],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  last_modified: {
    type: Date,
    default: Date.now,
  },
});

User.pre('save', function(next) {
  const user = this;
  user.last_modified = Date.now();
  if(!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if(err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if(err) {
        return next(err);
      }
      user.password = hash;
      return next();
    });
  });
});

export default mongoose.model('User', User);
