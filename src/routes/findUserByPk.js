const { User } = require('../db/sequelize')

module.exports = (req, res) => {
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