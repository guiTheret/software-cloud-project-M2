const express = require('express')
const router = express.Router()
const passwordF = require('../passport/password.js');
var connection = require('../db');

const passport = require('passport');


router.post('/register', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const lastName = req.body.lastName;
    const firstName = req.body.firstName;
    const selectSQL = "SELECT email from users WHERE email = ?;";
    connection.query(selectSQL, [email], async (error, results, fields) => {
        if (error) throw error;
        if (results.length > 0) {
            return res.status(409).json({ message: 'Utilisateur existe déjà' })
        } else {
            const hashedPassword = await passwordF.hashPassword(password);
            const sql = "INSERT INTO users (email, password, username, lastName, firstName) VALUES(?,?,?,?,?);";
            connection.query(sql, [email, hashedPassword, username, lastName, firstName], async (err, res2, fields) => {
                return res.status(200).json({ message: 'User added' })
            })
        }
    })

})

router.post('/login', passport.authenticate('local', {}),
    function (req, res) {
        const returnInfo = {
            username: req.user.username,
            email: req.user.email,
            isCleaner: req.user.isCleaner,
            id: req.user.id
        }
        return res.status(200).json({ message: 'User is authenticated', userInfo: returnInfo })
    });

router.get('/login', (req, res, next) => {
    if (req.user) {
        const returnInfo = {
            username: req.user.username,
            email: req.user.email,
            isCleaner: req.user.isCleaner,
            id: req.user.id
        }
        return res.status(200).json({ message: 'User is authenticated', userInfo: returnInfo })
    } else {
        return res.status(401).json({ message: 'User is not authenticated' })
    }
})


router.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        return res.status(200).json({ message: 'Logged out' })
    });
});

module.exports = router