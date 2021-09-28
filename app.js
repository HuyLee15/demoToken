const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv').config({ path: './config/config.env' });

const app = express();

app.use(express.json());

const posts = [{
        username: 'Felix',
        title: 'Post 1'
    },
    {
        username: 'HuyLee',
        title: 'Post 2'
    }
]

app.get('/posts', authenticateToken, (req, res) => {

    res.json(posts.filter(post => post.username === req.user.name));

})

app.post('/login', (req, res) => {
    // Authenticate User
    const username = req.body.username;
    const user = { name: username };

    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ token });

})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).send();

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, user) => {
        if (err) return res.status(403).send();
        req.user = user;
        next();
    })
}

app.listen(5000, console.log("Server is running"));