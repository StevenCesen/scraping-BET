const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3031;
const url_page = 'https://ec.betano.com/casino/games/aviator/25454/';

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

async function getData({response,url,endpoint}){
    if (url.includes(endpoint)) {
        try {
            const data = await response.json();
            return data;
        } catch (err) {
            return [];
        }
    }
}

let token='';

const sessions = new Map();
let browser;
let userCount = 0;

(async () => {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    if(token==''){
        await page.goto(url_page,{waitUntil: 'load', timeout: 0});

        try {
            await page.click('button#onetrust-accept-btn-handler')
        } catch (error) {
            console.log('Excepción cookies');
        }

        await delay(5000);

        try {
            await page.waitForSelector('.my-account-modal', { timeout: 5000 }).catch(() => {
                console.log('No se encontró el modal, continuando...');
            });
            await page.evaluate(() => {
                const modal = document.querySelector('.my-account-modal');
                if (modal) modal.remove();
            });

            await page.click('button[aria-label="Close modal"]');
            

        } catch (error) {
            console.log('Error al eliminar el modal');
        }

        // await delay(5000);
        // await page.click("button#accion_iniciarsesion")
        // await page.type('input#loginUsername','AdrianRo25')
        // await page.type('input#loginPassword','@drianromero19981119')

        // await delay(3000);

        // await page.evaluate(() => {
        //     const btns = Array.from(document.querySelectorAll('button'));

        //     if (btns[82]) {
        //         btns[82].click();
        //     }
        // });
        
        // await page.goto("https://ec.betano.com/casino/games/aviator/25454/",{waitUntil: 'load', timeout: 0})
    }
})();

app.listen(port, () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}`);
});