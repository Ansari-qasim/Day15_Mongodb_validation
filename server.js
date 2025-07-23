const express = require('express');
const mongoose = require('mongoose');
const Student = require('./Student');

const app = express();
app.use(express.json());

// Connect to MongoDB (no deprecated options)
mongoose.connect('mongodb://127.0.0.1:27017/studentsdb')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// POST route to add student
app.post('/add-student', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json({ message: 'Student added successfully', student });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = {};
            for (const field in err.errors) {
                errors[field] = err.errors[field].message;
            }
            return res.status(400).json({ error: 'Validation failed', details: errors });
        } else if (err.code === 11000) {
            return res.status(400).json({ error: 'Duplicate email detected' });
        }
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Start server
app.listen(3000, () => {
    console.log('🚀 Server is running on http://localhost:3000');
});
