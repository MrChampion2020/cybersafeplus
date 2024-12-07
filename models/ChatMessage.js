import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'senderModel' },
  receiver: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'receiverModel' },
  senderModel: { type: String, required: true, enum: ['User', 'Doctor'] },
  receiverModel: { type: String, required: true, enum: ['User', 'Doctor'] },
  message: { type: String, required: true },
  attachment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('ChatMessage', ChatMessageSchema);

