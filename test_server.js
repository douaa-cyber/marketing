const express = require('express');
const app = express();

app.get('/test', (req, res) => {
    res.send('Le fetch fonctionne correctement!');
});

app.listen(3000, () => {
    console.log('Serveur de test en cours d\'exécution sur le port 3000');
});