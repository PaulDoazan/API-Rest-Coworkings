let mockCoworkings = require('./mock-coworkings')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { success, getUniqueId } = require("./helper")
const express = require('express')
const serveFavicon = require('serve-favicon')
const app = express()
const port = 3000

app
    .use(serveFavicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World !')
})

app.get('/api/coworkings/:id', (req, res) => {
    const coworking = mockCoworkings.find(el => el.id === parseInt(req.params.id))
    const msg = coworking !== undefined ? "Un coworking a bien été trouvé." : "Aucun coworking trouvé."
    res.json(success(msg, coworking));
});

app.get('/api/coworkings', (req, res) => {
    res.json(success("La liste des coworkings a bien été récupérée.", mockCoworkings));
});

app.post('/api/coworkings', (req, res) => {
    const id = getUniqueId(mockCoworkings)
    // petit rappel sur le destructuring
    const coworkingCreated = { ...req.body, ...{ id: id, created: new Date() } }
    mockCoworkings.push(coworkingCreated)
    const message = `Le coworking ${coworkingCreated.name} a bien été créé.`
    res.json(success(message, coworkingCreated))
})

app.put('/api/coworkings/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const coworkingUpdated = { ...req.body, id: id }

    mockCoworkings = mockCoworkings.map(coworking => {
        return coworking.id === id ? coworkingUpdated : coworking;
    })

    const msg = `Le coworking ${coworkingUpdated.name} a bien été modifié.`
    res.json(success(msg, coworkingUpdated))
})

app.delete('/api/coworkings/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const coworkingDeleted = mockCoworkings.find(coworking => coworking.id === id)

    mockCoworkings.forEach(coworking => {
        if (coworking.id !== id) return coworking
    });

    const msg = `Le coworking ${coworkingDeleted.name} a bien été supprimé.`

    res.json(success(msg, mockCoworkings))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

