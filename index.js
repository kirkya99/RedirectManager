const express = require("express");
const fs = require("fs");
const app = express();
const filename = __dirname + "/storage.json";
const port = 3000
const token = process.env.BEARER_TOKEN

//Middleware
app.use(express.json()); //for parsing application/json
// app.use(cors()); //for configuring Cross-Origin Resource Sharing (CORS)
function log(req, res, next) {
    console.log(req.method + " Request at" + req.url);
    next();
}
app.use(log);



// Dieser Endpunkt soll dazu dienen, dass die slug zur entsprechenden
// Domain aufgelöst und mittels express.redirect() umgeleitet wird
app.get('/:slug', (req, res) => {
    
});

// Soll alle Einträge aus der JSON‐Datei ausgeben
app.get('/entries', (req, res) => {
    print(readStorage);
});

// Eintrag mit der gegebenen Slug aus der Datei entfernen
app.delete('/entry/:slug', (req, res) => {

});

// Soll eine URL und eine Slug entgegennehmen zum Abspeichern für
// späteres weiterleiten. Wird keine Slug mitgegeben, soll eine zufällige
// generiert werden.
app.post('/entry', (req, res) => {

});

// Funktion zum Lesen der storage.json
const readStorage = () => {
    return JSON.parse(fs.readFileSync('storage.json', 'utf8'));
};

app.listen(port, () => console.log(`Server listening on port ${port}!`));