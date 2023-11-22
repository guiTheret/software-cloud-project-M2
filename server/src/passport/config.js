// The local authentication strategy authenticates users using a username and password. 
// The strategy requires a verify callback, which accepts these credentials and calls done providing a user.
module.exports = passport => {
    var connection = require("../db.js");
    const passwordF = require('./password');
    const LocalStrategy = require('passport-local').Strategy
    const verifyCallBack = (username, password, done) => {
        connection.query(`SELECT * FROM users WHERE username='${username}'`, (error, results, fields) => {
            if (error) return done(error);
            if (results.length == 0) return done(null, false);
            const isValidPassword = passwordF.verifyPassword(password, results[0].password);
            return isValidPassword ? done(null, results[0]) : done(null, false);
        })
    }
    const strategy = new LocalStrategy(verifyCallBack);
    passport.use(strategy);

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((userId, done) => {
        connection.query(`SELECT * FROM users where id=${userId}`, (error, results, fields) => {
            done(null, results[0]);
        })
    })
}


