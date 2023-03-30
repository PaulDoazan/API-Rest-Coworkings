const morgan = require('morgan')
const bodyParser = require('body-parser')
const express = require('express')
const serveFavicon = require('serve-favicon')
const sequelize = require('./src/db/sequelize')
const cors = require('cors')

const app = express()
const port = 3000

sequelize.initDb();

app
    .use(serveFavicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())
    .use(cors())

// const coworkingRouter = express.Router();

app
    .route('/api/coworkings')
    .get(require('./src/routes/findAllCoworkings'))
    .post(require('./src/routes/createCoworking'))

app
    .route('/api/coworkings/:id')
    .get(require('./src/routes/findCoworkingByPk'))
    .put(require('./src/routes/updateCoworking'))
    .delete(require('./src/routes/deleteCoworking'))

app
    .route('/api/raw-coworkings')
    .get(require('./src/routes/findCoworkingsRawQuery'))

app
    .route('/api/login')
    .post(require('./src/routes/login'))

app
    .route('/api/users')
    .get(require('./src/routes/findAllUsers'))

app
    .route('/api/users/:id')
    .get(require('./src/routes/findUserByPk'))

app.get('/', (req, res) => {
    const message = 'Hello Coworkings !';
    res.json({ message })
})

// 404 errors handler
app.use((req, res) => {
    const message = 'Impossible de trouver la ressource demandée ! Essayez une autre url.'
    res.status(404).json({ message })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

