const bcrypt = require('bcrypt')

const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                console.error(err)
                reject(err);
            }
            resolve(hash);
        })
    })

}

const verifyPassword = (password, hashPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashPassword, (err, res) => {
            if (err) {
                console.error(err)
                reject(err);
            }
            if (res) {
                //correct password
                resolve(true);
            } else {
                resolve(false);
            }
        })
    })

}

module.exports = {
    verifyPassword,
    hashPassword,
}