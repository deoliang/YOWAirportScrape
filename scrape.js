const puppeteer = require('puppeteer');
const url = 'https://yow.ca/en/flights/departures';
const earlierFlightsSelector = '.toggle-text'
const $ = require('cheerio');
const fs = require('fs');
const YOWDestinations = {
    "Cities": []
}

const uniqueSet = new Set();
puppeteer.launch().then(async browser => {
    const page = await browser.newPage();
    await page.goto(url);
    await page.click(earlierFlightsSelector)
    await page.waitFor(300);
    let html = await page.content();
    await $('.flightDestOrig',html).each(function(i, elem) {
        if(uniqueSet.has($(this).text()))return true;
         uniqueSet.add($(this).text());
     });
    YOWDestinations.Cities = await [...uniqueSet].sort();
            
    await fs.writeFile('YOWDestinations.json', JSON.stringify(YOWDestinations), function(err){
        if (err) throw err;
        console.log("Successfully Written to File.");
    });
    await browser.close();
});