const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// In-memory database
let users = [];
let familyMembers = [
    { id: '1', name: 'Omar Al-Rashid', gender: 'male', relation: 'Grandfather', generation: 1, status: 'deceased' },
    { id: '2', name: 'Aisha Omar', gender: 'female', relation: 'Grandmother', generation: 1, status: 'deceased' },
    { id: '3', name: 'Hassan Omar', gender: 'male', relation: 'Father', generation: 2, status: 'living' },
    { id: '4', name: 'Fatima Hassan', gender: 'female', relation: 'Mother', generation: 2, status: 'living' },
    { id: '5', name: 'Ali Hassan', gender: 'male', relation: 'Son', generation: 3, status: 'living' },
    { id: '6', name: 'Sara Al-Rashid', gender: 'female', relation: 'Daughter', generation: 3, status: 'living' },
    { id: '7', name: 'Layla Hassan', gender: 'female', relation: 'Daughter', generation: 3, status: 'living' }
];

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ==========================================
// AUTH ENDPOINTS
// ==========================================
app.post('/api/auth/send-code', (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone required' });
    // In production, integrate SMS API here.
    res.json({ success: true, message: 'Code sent successfully', code: '12345' }); // Returning code for frontend testing
});

app.post('/api/auth/verify', (req, res) => {
    const { phone, code } = req.body;
    if (code !== '12345') return res.status(400).json({ success: false, message: 'Invalid code' });
    
    let user = users.find(u => u.phone === phone);
    if (!user) {
        user = { id: crypto.randomUUID(), phone, profileSetup: false };
        users.push(user);
    }
    res.json({ success: true, token: 'dummy-jwt-token', user });
});

app.post('/api/user/profile', (req, res) => {
    const { phone, fullName, username, bio } = req.body;
    let user = users.find(u => u.phone === phone);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    Object.assign(user, { fullName, username, bio, profileSetup: true });
    res.json({ success: true, user });
});

// ==========================================
// MEDIA UPLOAD
// ==========================================
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    res.json({ success: true, fileUrl: `http://localhost:${PORT}/uploads/${req.file.filename}` });
});

// ==========================================
// FAMILY TREE CRUD
// ==========================================
app.get('/api/family-tree', (req, res) => {
    res.json(familyMembers);
});

app.post('/api/family-tree/member', (req, res) => {
    const { name, gender, relation, generation, status } = req.body;
    const newMember = { id: crypto.randomUUID(), name, gender, relation, generation, status };
    familyMembers.push(newMember);
    res.json({ success: true, member: newMember });
});

app.put('/api/family-tree/member/:id', (req, res) => {
    const { id } = req.params;
    let member = familyMembers.find(m => m.id === id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    
    Object.assign(member, req.body);
    res.json({ success: true, member });
});

app.delete('/api/family-tree/member/:id', (req, res) => {
    const { id } = req.params;
    familyMembers = familyMembers.filter(m => m.id !== id);
    res.json({ success: true });
});

// ==========================================
// STATISTICS
// ==========================================
app.get('/api/family-tree/stats', (req, res) => {
    const generations = familyMembers.reduce((acc, m) => {
        acc[m.generation] = (acc[m.generation] || 0) + 1;
        return acc;
    }, {});

    res.json({
        members: familyMembers.length,
        males: familyMembers.filter(m => m.gender === 'male').length,
        females: familyMembers.filter(m => m.gender === 'female').length,
        living: familyMembers.filter(m => m.status === 'living').length,
        deceased: familyMembers.filter(m => m.status === 'deceased').length,
        generations: Object.keys(generations).length,
        genBreakdown: generations
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
