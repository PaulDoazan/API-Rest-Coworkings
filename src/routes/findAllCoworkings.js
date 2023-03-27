const { Coworking } = require('../db/sequelize')

module.exports = (app) => {
    app.get('/api/coworkings', (req, res) => {
        Coworking.findAll()
            .then(coworkings => {
                const msg = "La liste des coworkings a bien été récupérée."
                res.json({ message: msg, data: coworkings });
            })
            .catch(error => {
                const message = `La liste des coworkings n'a pas pu se charger. Reessayez ulterieurement.`
                res.status(500).json({ message, data: error })
            })
    });
}