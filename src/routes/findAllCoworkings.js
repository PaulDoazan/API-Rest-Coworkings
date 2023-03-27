const { Coworking } = require('../db/sequelize')
const { Op } = require('sequelize');

module.exports = (app) => {
    app.get('/api/coworkings', (req, res) => {
        if (req.query.name) {
            const queryName = req.query.name;
            return Coworking.findAll({ where: { name: { [Op.like]: `%${queryName}%` } } })
                .then(coworkings => {
                    const message = `Il y a ${coworkings.length} comme résultat de la requête.`
                    res.json({ message, data: coworkings })
                })
        } else {
            Coworking.findAll()
                .then(coworkings => {
                    const msg = "La liste des coworkings a bien été récupérée."
                    res.json({ message: msg, data: coworkings });
                })
                .catch(error => {
                    const message = `La liste des coworkings n'a pas pu se charger. Reessayez ulterieurement.`
                    res.status(500).json({ message, data: error })
                })
        }
    });
}