const { User } = require('../db/sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key')

module.exports = (req, res) => {
    User.findOne({ where: { username: req.body.username } }).then(user => {
        if (!user) {
            const message = "L'utilisateur demandé n'existe pas."
            return res.status(404).json({ message })
        }
        bcrypt.compare(req.body.password, user.password).then(isPasswordValid => {
            if (!isPasswordValid) {
                const message = `Le mot de passe est incorrect.`;
                return res.status(404).json({ message })
            }

            // JWT
            const token = jwt.sign(
                {
                    data: user.id
                },
                privateKey,
                { expiresIn: '1h' }
            )

            const message = `L'utilisateur a été connecté avec succès`;
            return res.json({ message, data: user, token })
        })
    }).catch(error => {
        const message = "L'utilisateur n'a pas pu être connecté. Réessayez ultérieurement."
        return res.json({ message, data: error })
    })
}