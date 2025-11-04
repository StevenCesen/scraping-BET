const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3030;
const url_page = `https://launch.spribegaming.com/%7Bgame%7D/aviator?user=2481917&token=170P2481917P0r7niqavhddjslzwel&lang=es&currency=USD&operator=ecuabet`

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

let token = '';

const sessions = new Map();
let browser;

(async () => {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    if (token == '') {
        await page.goto(url_page, { waitUntil: 'load', timeout: 0 });

        await delay(3000);

        const payoutsData = await page.evaluate(() => {
            const container = document.querySelector('.payouts-block');
            if (!container) return null;

            const children = Array.from(container.querySelectorAll('.payout')).map(el => ({
                text: el.innerText.trim(),
                color: el.style.color,
            }));

            return {
                totalChildren: children.length,
                children,
            };
        });

        console.log(payoutsData);

        // await page.click("button#accion_iniciarsesion")
        // await page.type('input#loginUsername', 'adrianromerogato0@gmail.com')
        // await page.type('input#loginPassword', 'Adrianromero19981119')
        // await page.click('button[aria-label="Login"]');
        // await delay(2000);
        // await page.goto("https://ecuabet.com/new-casino/203831", { waitUntil: 'load', timeout: 0 });
        // await page.waitForSelector('#game-content');
        // const elementHandle = await page.$('#game-content');
        // const frame = await elementHandle.contentFrame();
        // const title = await frame.title();
    }
})();

app.listen(port, () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
