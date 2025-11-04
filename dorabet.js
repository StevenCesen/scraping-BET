const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3032;
const url_page = 'https://aviator-demo.spribegaming.com/?currency=USD&operator=demo&jurisdiction=CW&lang=es&return_url=https%3A%2F%2F1wwqux.life%2Fcasino&user=77970&token=fCyjVleHj0yr8Cm681f3dV48AjE7T1ie';


function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

let token = '';

const sessions = new Map();
let browser;
let userCount = 0;

(async () => {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url_page, { waitUntil: 'load', timeout: 0 });
    await delay(5000);
    // const payouts = await page.evaluate(() => {
    //     const container = document.querySelector('.payouts-block');
    //     if (!container) return null;        
    //     const children = Array.from(container.children).map(el => ({
    //         text: el.innerText.trim(),
    //         color: el.style.color,          
    //     }));
    //     return {
    //         totalChildren: children.length,
    //         children,
    //     };
    // });
    // console.log(payouts);
    await page.exposeFunction("onNewPayoutAdded", (childText) => {
        console.log("Nuevo hijo detectado:", childText);
    });

    await page.evaluate(() => {
        const container = document.querySelector('.payouts-block');
        if (!container) return;

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const text = node.innerText?.trim();
                            window.onNewPayoutAdded(text);
                        }
                    });
                }
            }
        });

        observer.observe(container, { childList: true });
    });
})();

app.listen(port, () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
