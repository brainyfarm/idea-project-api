import mongoose from 'mongoose';

const Idea = new mongoose.Schema({
  content: {
    type: String,
    min: [8, 'idea too short'],
    max: [255, 'idea too long'],
    required: [true, 'please provide the content of idea'],
  },
  impact: {
    type: Number,
    min: [1, 'impact should range from 1 to 10'],
    max: [10, 'impact should range from 1 to 10'],
    required: [true, 'Please provide an impact value'],
  },
  ease: {
    type: Number,
    min: [1, 'ease should range from 1 to 10'],
    max: [10, 'ease should range from 1 to 10'],
    required: [true, 'Please provide an ease value'],
  },
  confidence: {
    type: Number,
    min: [1, 'confidence should range from 1 to 10'],
    max: [10, 'confidence should range from 1 to 10'],
    required: [true, 'Please provide a confidence value'],
  },
  average_score: {
    type: Number,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

Idea.pre('save', function(next) {
  const idea = this;
  idea.last_modified = Date.now();

  if(idea.isModified('impact') || idea.isModified('ease') || idea.isModified('confidence')) {
    const average_score = (idea.impact + idea.ease + idea.confidence) / 3;
    idea.average_score = average_score;
    return next();
  }
  return next();
});
export default mongoose.model('Idea', Idea);
