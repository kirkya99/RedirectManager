const express = require('express');
const fs = require('fs');
const app = express();
const token = process.env.BEARER_TOKEN || '123456';
const PORT = process.env.PORT || 3000;
const fileName = __dirname + '/storage.json';

let slugCounter = 0;

app.use(express.json());


// Middleware für Authentifizierung
const authenticate = (req, res, next) => {
    const bearerHeader = req.headers['Authorization'];
    if (typeof bearerHeader !== 'undefined') {

        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        if (bearerToken !== token) {
            return res.status(401).send('Unauthorized');
        }
    }
    next();
};

// Endpunkte

// Soll alle Einträge aus der JSON‐Datei ausgeben
const readStorage = () => {
    return JSON.parse(fs.readFileSync(fileName, 'utf8'));
};

// Route zum Anzeigen aller Einträge
app.get('/entries', authenticate, (req, res) => {
    res.json(readStorage());
});

// Dieser Endpunkt soll dazu dienen, dass die slug zur entsprechenden
// Domain aufgelöst und mittels express.redirect() umgeleitet wird
app.get('/:slug', (req, res) => {
    const {slug} = req.params;
    const redirects = readStorage();
    const redirect = redirects.find(r => r.slug === slug);
    if (redirect) {
        res.redirect(redirect.url);
    } else {
        res.status(404).send('Slug not found');
    }
});


// Eine Url und Slug werden für das spätere weiterleiten abgespeichert
app.post('/entry', (req, res) => {
    let {slug, url} = req.body;
    if (!slug) {
        slug = "slug" + slugCounter++;
    }
    if (!url) {
        return res.status(400).send('Missing url');

    }

    // TODO: Überprüfung der URL, ob https:// oder http:// vorhanden ist
    // if(url.substring(0, 8) !== "https://" || url.substring(0, 7) !== "http://")
    const redirects = readStorage();
    redirects.push({slug, url});
    fs.writeFileSync(fileName, JSON.stringify(redirects));
    res.status(201).send('Entry added');
});

// Eintrag mit der gegebenen Slug aus der Datei entfernen
app.delete('/entry/:slug', authenticate, (req, res) => {
    const {slug} = req.params;
    let redirects = readStorage();
    const redirectIndex = redirects.findIndex(r => r.slug === slug);
    if (redirectIndex > -1) {
        redirects.splice(redirectIndex, 1);
        fs.writeFileSync(fileName, JSON.stringify(redirects));
        res.send('Entry deleted');
    } else {
        res.status(404).send('Slug not found');
    }
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});