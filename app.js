const morgan = require('morgan')
const bodyParser = require('body-parser')
const express = require('express')
const serveFavicon = require('serve-favicon')
const sequelize = require('./src/db/sequelize')

const app = express()
const port = 3000

sequelize.initDb();

app
    .use(serveFavicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())

require('./src/routes/findAllCoworkings')(app)
require('./src/routes/findCoworkingByPk')(app)
require('./src/routes/createCoworking')(app)
require('./src/routes/updateCoworking')(app)
require('./src/routes/deleteCoworking')(app)

app.use((req, res) => {
    const message = 'Impossible de trouver la ressource demandée ! Essayez une autre url.'
    res.status(404).json({ message })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.get('/', (req, res) => {
    res.send('Hello World !')
})