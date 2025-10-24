const mongoose = require('mongoose');
const RefreshToken = require('./models/RefreshToken');

mongoose.connect('mongodb://localhost:27017/group10-project', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

async function testCRUD() {
    try {
        const tokenValue = 'test-refresh-token-001';
        const userId = '64ffb8e7c8a1a1234567890a';
        const expiresAt = new Date(Date.now() + 7*24*60*60*1000);

        const token = new RefreshToken({ token: tokenValue, userId, expiresAt });
        await token.save();
        console.log('✅ Token saved:', token);

        const stored = await RefreshToken.findOne({ token: tokenValue });
        console.log('🔍 Token retrieved from DB:', stored);

        await RefreshToken.deleteOne({ token: tokenValue });
        console.log('🗑 Token deleted');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        mongoose.connection.close();
    }
}

testCRUD();
