const express = require('express');
const authMiddleware = require('../middleware/auth');
const PrakritiRecord = require('../models/PrakritiRecord');
const User = require('../models/User');

const router = express.Router();

// Get all prakriti records for current user
router.get('/records', authMiddleware, async (req, res) => {
  try {
    const records = await PrakritiRecord.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new prakriti record
router.post('/records', authMiddleware, async (req, res) => {
  try {
    const { studentName, prakritiType, followUpDate, notes } = req.body;

    if (!studentName || !prakritiType || !followUpDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const record = new PrakritiRecord({
      userId: req.userId,
      studentName,
      prakritiType,
      followUpDate,
      notes: notes || '',
      status: 'Pending'
    });

    await record.save();
    res.status(201).json({ message: 'Record created successfully', record });
  } catch (error) {
    console.error('Create record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit prakriti analysis result (from prakriti-analysis.html)
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    console.log('📥 Prakriti submission received');
    console.log('User ID:', req.userId);
    console.log('Request body:', req.body);
    
    const { prakritiType, scores } = req.body;

    if (!prakritiType) {
      console.log('❌ Missing prakriti type');
      return res.status(400).json({ message: 'Prakriti type is required' });
    }

    // Get current user's name
    const user = await User.findById(req.userId);
    if (!user) {
      console.log('❌ User not found:', req.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User found:', user.name, user.email);

    // Create a record with user's own name and a follow-up date (7 days from now)
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 7);

    const record = new PrakritiRecord({
      userId: req.userId,
      studentName: user.name,
      prakritiType: prakritiType.charAt(0).toUpperCase() + prakritiType.slice(1),
      followUpDate: followUpDate,
      notes: scores ? `Analysis scores - Vata: ${scores.vata}, Pitta: ${scores.pitta}, Kapha: ${scores.kapha}` : 'Self-assessment completed',
      status: 'Pending'
    });

    await record.save();
    console.log('✅ Prakriti analysis saved for user:', user.email, '- Type:', prakritiType);
    console.log('Record ID:', record._id);
    
    res.status(201).json({ 
      message: 'Prakriti analysis saved successfully', 
      record,
      followUpDate: followUpDate 
    });
  } catch (error) {
    console.error('❌ Submit prakriti error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Update prakriti record status
router.put('/records/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const record = await PrakritiRecord.findOne({ _id: id, userId: req.userId });
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    if (status) record.status = status;
    if (notes !== undefined) record.notes = notes;
    record.updatedAt = Date.now();

    await record.save();
    res.json({ message: 'Record updated successfully', record });
  } catch (error) {
    console.error('Update record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete prakriti record
router.delete('/records/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const record = await PrakritiRecord.findOneAndDelete({ _id: id, userId: req.userId });
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Delete record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
