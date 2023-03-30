const { ValidationError, UniqueConstraintError } = require('sequelize')
const { Review, User, Coworking } = require('../db/sequelize')
const { Op } = require('sequelize')

exports.findAllReviews = (req, res) => {
    const queryLimit = parseInt(req.query.limit) || 3;
    if (req.query.name) {
        if (req.query.name.length < 2) {
            const message = `Le terme de recherche doit contenir au minimum 2 caractères..`
            return res.status(400).json({ message })
        }
        const queryName = req.query.name;
        return Review.findAndCountAll({ where: { name: { [Op.like]: `%${queryName}%` } }, limit: queryLimit })
            .then(({ count, rows }) => {
                const message = `Il y a ${count} résultat(s).`
                res.json({ message, data: rows })
            })
    } else {
        Review.findAll({ limit: queryLimit })
            .then(reviews => {
                const msg = "La liste des avis a bien été récupérée."
                res.json({ message: msg, data: reviews });
            })
            .catch(error => {
                const message = `La liste des avis n'a pas pu se charger. Reessayez ulterieurement.`
                res.status(500).json({ message, data: error })
            })
    }
}

exports.findReviewByPk = (req, res) => {
    Review.findByPk(req.params.id)
        .then(review => {
            if (review === null) {
                const message = `L'avis demandé n'existe pas.`
                res.status(404).json({ message })
            } else {
                const message = "Un avis a bien été trouvé."
                res.json({ message, data: review });
            }
        })
        .catch(error => {
            const message = `La liste des avis n'a pas pu se charger. Reessayez ulterieurement.`
            res.status(500).json({ message, data: error })
        })
}

exports.createReview = (req, res) => {
    Review.create({
        content: "Great place",
        rating: 4,
        UserId: 1,
        CoworkingId: 1
    })
        .then(reviewCreated => {
            const message = `L'avis ${reviewCreated.content} a bien été créé.`
            res.json({ message, data: reviewCreated })
        })
        .catch(error => {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            if (error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error })
            }

            const message = `L'avis' n'a pas pu être créé. Reessayez ulterieurement.`
            res.status(500).json({ message, data: error })
        })
}
