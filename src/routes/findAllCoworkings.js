const { Coworking } = require('../db/sequelize')

module.exports = (app) => {
    app.get('/api/coworkings', (req, res) => {
        Coworking.findAll()
            .then(coworkings => {
                const msg = "La liste des coworkings a bien été récupérée."
                res.json({ message: msg, data: coworkings });
            })
    });
}