const express = require('express'); // import express -> npm i express
const { scrapeLogic } = require('./scrapeLogic'); // require the local scriptLogic file
const app = express();

const PORT = process.env.PORT || 4000; // because we don't always know what port the app is going to be running on

// second endpoint
app.get('/scrape', (req, res) => {
	scrapeLogic(res);
});

// first endpoint (root)
app.get('/', (req, res) => {
	res.send('Render Puppeteer server is up and running');
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
