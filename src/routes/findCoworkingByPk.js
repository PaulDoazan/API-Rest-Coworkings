const { Coworking } = require('../db/sequelize')

module.exports = (app) => {
    app.get('/api/coworkings/:id', (req, res) => {
        const coworking = Coworking.findByPk(req.params.id)
            .then(coworking => {
                if (coworking === null) {
                    const message = `Le coworking demandé n'existe pas.`
                    res.status(404).json({ message })
                } else {
                    const message = "Un coworking a bien été trouvé."
                    res.json({ message, data: coworking });
                }
            })
            .catch(error => {
                const message = `La liste des coworkings n'a pas pu se charger. Reessayez ulterieurement.`
                res.status(500).json({ message, data: error })
            })
    });
}