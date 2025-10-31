const mongoose = require('mongoose');

const prakritiRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  prakritiType: { type: String, required: true, enum: ['Vata', 'Pitta', 'Kapha'] },
  followUpDate: { type: Date, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Done'] },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PrakritiRecord', prakritiRecordSchema);
