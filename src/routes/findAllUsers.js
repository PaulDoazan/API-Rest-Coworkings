const { User } = require('../db/sequelize')
const { Op } = require('sequelize')

module.exports = (req, res) => {
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