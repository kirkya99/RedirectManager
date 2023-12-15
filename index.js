const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
const token = 123456;

// Middleware für Authentifizierung
const authenticate = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {

        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        if (bearerToken !== token) {
            return res.status(401).send('Unauthorized');
        }
    }
    next();
};

// Funktion zum Lesen der storage.json
const readStorage = () => {
    return JSON.parse(fs.readFileSync('storage.json', 'utf8'));
};

// Route zum Anzeigen aller Einträge
app.get('/entries', authenticate, (req, res) => {
    res.json(readStorage());
});

// Route zum Umleiten basierend auf dem Slug
app.get('/:slug', (req, res) => {
    const { slug } = req.params;
    const redirects = readStorage();
    const redirect = redirects.find(r => r.slug === slug);
    if (redirect) {
        res.redirect(redirect.url);
    } else {
        res.status(404).send('Slug not found');
    }
});

// Route zum Hinzufügen eines neuen Eintrags
app.post('/entry', (req, res) => {
    const { slug, url } = req.body;
    if (!slug || !url) {
        return res.status(400).send('Missing slug or url');
    }
    const redirects = readStorage();
    redirects.push({ slug, url });
    fs.writeFileSync('storage.json', JSON.stringify(redirects));
    res.status(201).send('Entry added');
});

// Route zum Löschen eines Eintrags
app.delete('/entry/:slug', authenticate, (req, res) => {
    const { slug } = req.params;
    let redirects = readStorage();
    const redirectIndex = redirects.findIndex(r => r.slug === slug);
    if (redirectIndex > -1) {
        redirects.splice(redirectIndex, 1);
        fs.writeFileSync('storage.json', JSON.stringify(redirects));
        res.send('Entry deleted');
    } else {
        res.status(404).send('Slug not found');
    }
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});