// const express = require("express");
// const fs = require("fs");
// const app = express();
// const filename = __dirname + "/storage.json";
// const port = 3000
// const token = process.env.BEARER_TOKEN

// //Middleware
// app.use(express.json()); //for parsing application/json
// // app.use(cors()); //for configuring Cross-Origin Resource Sharing (CORS)
// function log(req, res, next) {
//     console.log(req.method + " Request at" + req.url);
//     next();
// }
// app.use(log);

// // Dieser Endpunkt soll dazu dienen, dass die slug zur entsprechenden
// // Domain aufgelöst und mittels express.redirect() umgeleitet wird
// app.get('/:slug', (req, res) => {
    
// });

// // Soll alle Einträge aus der JSON‐Datei ausgeben
// app.get('/entries', (req, res) => {
//     const entries = loadDataFromFile();
//     res.json(entries); 
// });

// // Eintrag mit der gegebenen Slug aus der Datei entfernen
// app.delete('/entry/:slug', (req, res) => {
//     const { slug } = req.params;
//     let entries = loadDataFromFile();
//     entries = entries.filter(entry => entry.slug !== slug);
//     saveDataToFile(entries);
//     res.json({ message: 'Entry deleted successfully' });
// });

// // Soll eine URL und eine Slug entgegennehmen zum Abspeichern für
// // späteres weiterleiten. Wird keine Slug mitgegeben, soll eine zufällige
// // generiert werden.
// app.post('/entry', (req, res) => {

// });

// // Funktion zum Lesen der storage.json
// const readStorage = () => {
//     return JSON.parse(fs.readFileSync('storage.json', 'utf8'));
// };

// // Funktion zum Speichern von Daten in die JSON-Datei
// function saveDataToFile(data) {
//     fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
// }

const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
const token = process.env.BEARER_TOKEN || 'StandardToken';

// Middleware für Authentifizierung
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${token}`) {
        return res.status(401).send('Unauthorized');
    }
    next();
};

// Funktion zum Lesen der storage.json
const readStorage = () => {
    return JSON.parse(fs.readFileSync('storage.json', 'utf8'));
};

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

// Route zum Anzeigen aller Einträge
app.get('/entries', authenticate, (req, res) => {
    res.json(readStorage());
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