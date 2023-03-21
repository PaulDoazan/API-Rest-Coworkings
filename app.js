const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World !')
})

app.get('/api/coworkings/:id', (req, res) => {
    const coworkingId = req.params.id;
    // Utiliser coworkingId pour récupérer les données correspondantes dans la base de données
    res.send(`Vous avez demandé les informations pour le coworking numéro ${coworkingId}`);
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})