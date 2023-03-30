const { User } = require('../db/sequelize')
const { Op } = require('sequelize')

exports.findAllUsers = (req, res) => {
    const queryLimit = parseInt(req.query.limit) || 3;
    if (req.query.name) {
        if (req.query.name.length < 2) {
            const message = `Le terme de recherche doit contenir au minimum 2 caractères..`
            return res.status(400).json({ message })
        }
        const queryName = req.query.name;
        return User.findAndCountAll({ where: { name: { [Op.like]: `%${queryName}%` } }, limit: queryLimit })
            .then(({ count, rows }) => {
                const message = `Il y a ${count} résultat(s).`
                res.json({ message, data: rows })
            })
    } else {
        User.findAll({ limit: queryLimit })
            .then(users => {
                const msg = "La liste des utilisateurs a bien été récupérée."
                res.json({ message: msg, data: users });
            })
            .catch(error => {
                const message = `La liste des utilisateurs n'a pas pu se charger. Reessayez ulterieurement.`
                res.status(500).json({ message, data: error })
            })
    }
}

exports.findUserByPk = (req, res) => {
    const user = User.findByPk(req.params.id)
        .then(user => {
            if (user === null) {
                const message = `L'utilisateur demandé n'existe pas.`
                res.status(404).json({ message })
            } else {
                const message = "Un utilisateur a bien été trouvé."
                res.json({ message, data: user });
            }
        })
        .catch(error => {
            const message = `La liste des utilisateurs n'a pas pu se charger. Reessayez ulterieurement.`
            res.status(500).json({ message, data: error })
        })
}