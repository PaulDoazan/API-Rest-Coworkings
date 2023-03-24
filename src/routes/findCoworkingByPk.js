const { Coworking } = require('../db/sequelize')

module.exports = (app) => {
    app.get('/api/coworkings/:id', (req, res) => {
        const coworking = Coworking.findByPk(req.params.id)
            .then(coworking => {
                const message = coworking !== undefined ? "Un coworking a bien été trouvé." : "Aucun coworking trouvé."
                res.json({ message, data: coworking });
            })
    });
}