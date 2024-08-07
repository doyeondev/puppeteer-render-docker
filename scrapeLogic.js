const puppeteer = require('puppeteer');
require('dotenv').config(); // import dotenv
// create new function
// access response object express provides for us and pass it as a parameter to scrapeLogic
// within scrapeLogic, access response object and use it to send a response "..."
const scrapeLogic = async res => {
	// Launch the browser and open a new blank page
	const browser = await puppeteer.launch({
		// set launch arguments for Chromium
		args: [
			'--disable-setuid-sandbox', // --disable-setuid-sandbox is strictly better than --no-sandbox since you'll at least get the seccomp sandbox
			'--no-sandbox', // disable Linux sandboxing (A common cause for Chrome to crash during startup is running Chrome as root user (administrator) on Linux.)
			'--single-process', // (including --no-zygote) so that we don't run too many Chromium processes at the same time
			'--no-zygote', // prevents the Chrome driver from initiating the Zygote process
		],
		// set executable path to PUPPETEER_EXECUTABLE_PATH only if we are currently in production
		// otherwise, we will use the default executable path that Puppeteer provides
		executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
	}); // outside of try-catch block because we want it to be accessible within the finally scope below
	// if something goes wrong with puppeteer's launch method within try, that will going to crash our app

	// wrap scrapeLogic in try-catch-finally
	try {
		const page = await browser.newPage();
		// throw new Error('Whoops!'); // dummy error test for catch block

		// Navigate the page to a URL.
		await page.goto('https://developer.chrome.com/');

		// Set screen size.
		await page.setViewport({ width: 1080, height: 1024 });

		// Type into search box
		await page.type('.devsite-search-field', 'automate beyond recorder');

		// Wait and click on first result
		const searchResultSelector = '.devsite-result-item-link';
		await page.waitForSelector(searchResultSelector);
		await page.click(searchResultSelector);

		// Locate the full title with a unique string
		const textSelector = await page.waitForSelector('text/Customize and automate');
		const fullTitle = await textSelector.evaluate(el => el.textContent);

		// Print the full title.
		const logStatement = `The title of this blog post is ${fullTitle}`;
		console.log(logStatement);
		res.send(logStatement);
	} catch (e) {
		console.error(e);
		// in case we catch error, also send a response to the user
		res.send(`Something went wrong while running Puppeteer: ${e}`);
	} finally {
		// have the browser close no matter what
		await browser.close();
	}
};

// export it as named export using module.exports
module.exports = { scrapeLogic };
