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
        return Review.findAndCountAll({ where: { name: { [Op.like]: `%${queryName}%` } }, limit: queryLimit, include: User })
            .then(({ count, rows }) => {
                const message = `Il y a ${count} résultat(s).`
                res.json({ message, data: rows })
            })
    } else {
        Review.findAll({ include: [User.scope('withoutPassword'), Coworking] })
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
    Review.findByPk(req.params.id, { include: [User.scope('withoutPassword'), Coworking] })
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
        content: req.body.content,
        rating: req.body.rating,
        UserId: req.userId,
        CoworkingId: req.body.coworkingId
    })
        .then(reviewCreated => {
            const message = `L'avis n°${reviewCreated.id} a bien été créé.`
            res.json({ message, data: reviewCreated })
        })
        .catch(error => {
            if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error })
            }

            const message = `L'avis n'a pas pu être créé. Reessayez ulterieurement.`
            res.status(500).json({ message, data: error })
        })
}

exports.deleteReview = (req, res) => {
    Review.findByPk(req.params.id)
        .then(review => {
            if (review === null) {
                const message = `L'avis demandé n'existe pas.`
                return res.status(404).json({ message })
            }
            return Coworking.destroy({
                where: {
                    id: req.params.id
                }
            })
                .then(_ => {
                    const message = `L'avis n°${review.id} a bien été supprimé.`
                    res.json({ message, data: review });
                })
        })
        .catch(error => {
            const message = `Impossible de supprimer le coworking.`
            res.status(500).json({ message, data: error })
        })
}

exports.updateReview = (req, res) => {
    Review.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(_ => {
            // retourner la valeur d'une promesse permet de transmettre une erreur le cas échéant, rappel nécessaire
            return Review.findByPk(req.params.id)
                .then(review => {
                    if (review === null) {
                        const message = `Le commentaire demandé n'existe pas.`
                        res.status(404).json({ message })
                    } else {
                        const message = `Le commentaire n°${review.id} a bien été modifié.`
                        res.json({ message, data: review });
                    }
                })
        })
        .catch(error => {
            if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error })
            }

            const message = `Impossible de mettre à jour le commentaire.`
            res.status(500).json({ message, data: error })
        })
}