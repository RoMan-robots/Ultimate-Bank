const express = require('express');
const router = express.Router();
const { checkAuth } = require('../../model/query/auth');

router.get('/', async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : req.query.token;

    if (!token) {
        return res.status(401).json({ 
            message: 'No authentication token',
            isAuthenticated: false 
        });
    }

    try {
        const user = await checkAuth(token);
        
        if (user) {
            return res.status(200).json({ 
                message: 'Token is valid',
                isAuthenticated: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    balance: user.balance
                }
            });
        } else {
            return res.status(401).json({ 
                message: 'Invalid token',
                isAuthenticated: false 
            });
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(500).json({ 
            message: 'Server error during token verification',
            isAuthenticated: false 
        });
    }
});

module.exports = router;