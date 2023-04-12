const { Sequelize, DataTypes } = require('sequelize')
let mockCoworkings = require('./mock-coworkings')
const CoworkingModel = require('../models/coworking')
const UserModel = require('../models/user')
const ReviewModel = require('../models/review')
const bcrypt = require('bcrypt')

let sequelize;

if(process.env.NODE_ENV === 'production'){
    sequelize = new Sequelize(
        'shsiag7h4fjvtwrk',
        'rmhaa31ssy830jv5',
        'i4c5k9mkj39013gf',
        {
            host: 'q0h7yf5pynynaq54.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            dialect: 'mariadb',
            logging: false
        }
    )
} else {
    sequelize = new Sequelize(
        'bordeaux_coworking',
        'root',
        '',
        {
            host: 'localhost',
            dialect: 'mariadb',
            logging: false
        }
    )
}

sequelize.authenticate()
    .then(_ => console.log('La connexion à la base de données a bien été établie.'))
    .catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))

const Coworking = CoworkingModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)
const Review = ReviewModel(sequelize, DataTypes)

// associations
User.hasMany(Review, {
    foreignKey: {
        allowNull: false
    }
});
Review.belongsTo(User)

Coworking.hasMany(Review, {
    foreignKey: {
        allowNull: false
    }
});
Review.belongsTo(Coworking)


const initDb = () => {
    return sequelize.sync()
        .then(_ => {
            mockCoworkings.map((element, index) => {
                Coworking.create({
                    name: element.name,
                    price: element.price,
                    address: element.address,
                    picture: element.picture,
                    superficy: element.superficy,
                    capacity: element.capacity
                })
            })

            bcrypt.hash('mdp', 10).then(hash => {
                User.create({
                    username: 'pauld',
                    password: hash,
                    roles: ['user', 'admin']
                }).then(_ => {
                    Review.create({
                        content: 'First review',
                        rating: 4,
                        UserId: 1,
                        CoworkingId: 3
                    })

                    Review.create({
                        content: 'Second review',
                        rating: 5,
                        UserId: 1,
                        CoworkingId: 3
                    })
                })
            })

            bcrypt.hash('mdp', 10).then(hash => {
                User.create({
                    username: 'pierreb',
                    password: hash
                })
            })

            console.log(`La base a bien été synchronisée.`)
        })
}

module.exports = {
    initDb, Coworking, sequelize, User, Review
}