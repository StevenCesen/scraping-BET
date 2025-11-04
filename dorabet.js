const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3032;
const url_page = 'https://1wwqux.life/casino/play/aviator';


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

        await delay(2000);
        
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            if (btns[3]) {
                btns[3].click();
            }
        });

        await delay(1000);

        // await page.click("button.bg_secondary")
        await page.type('input#loginUsername','+593999557466')
        await page.type('input#loginPassword','FFs8UcmKU7b@VCq')

        await delay(5000);

        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));

            console.log(btns);

            if (btns[148]) {
                btns[148].click();
            }
        });
        
        // await page.goto("https://datadiverservice.com/consultation/search",{waitUntil: 'load', timeout: 0})
    }
    
    // await page.goto(`https://datadiverservice.com/consultation/${req.params.name}/client`,{waitUntil: 'load', timeout: 0});
    await delay(2000);
})();

app.get('/title/:name', async (req, res) => {
    try {
        const userId = `user${++userCount}`;

        const page = await browser.newPage();

        let data={
        info_general:{},
        info_contacts:{},
        info_vehicles:{},
        info_labour:{},
        info_property:{},
        info_favorities:{},
        info_family:{}
    };

    page.on('response', async (response) => {
        const url = response.url();
        const status = response.status();

        const login=await getData({response,url,endpoint:'api.datadiverservice.com/login'});
        const info_general=await getData({response,url,endpoint:'api.datadiverservice.com/ds/crn/client/info/general/new'});
        const info_contacts=await getData({response,url,endpoint:'api.datadiverservice.com/ds/crn/client/info/contact'});
        const info_vehicles=await getData({response,url,endpoint:'api.datadiverservice.com/ds/crm/client/vehicle'});
        const info_labour=await getData({response,url,endpoint:'api.datadiverservice.com/ds/crn/client/info/labournew'});
        const info_property=await getData({response,url,endpoint:'api.datadiverservice.com/ds/crm/client/property'});
        const info_favorities=await getData({response,url,endpoint:'api.datadiverservice.com/ds/crn/client/favorites'});

        if(login!==undefined){
            token=login.accessToken;
        }

        if(info_general!==undefined){
            data.info_general=info_general;
        }
        if(info_contacts!==undefined){
            data.info_contacts=info_contacts;
        }
        if(info_vehicles!==undefined){
            data.info_vehicles=info_vehicles;
        }
        if(info_labour!==undefined){
            data.info_labour=info_labour;
        }
        if(info_property!==undefined){
            data.info_property=info_property;
        }
        if(info_favorities!==undefined){
            data.info_favorities=info_favorities;
        }
    });

    if(token==''){
        await page.goto(url_page,{waitUntil: 'load', timeout: 0});
        await page.click("button.bg_secondary")
        // await page.type('input#mat-input-0','GESTOR3@SEFILSA')
        // await page.type('input#mat-input-1','SEFILSA.G3')
        await delay(5000);
        // await page.goto("https://datadiverservice.com/consultation/search",{waitUntil: 'load', timeout: 0})
    }
    
    // await page.goto(`https://datadiverservice.com/consultation/${req.params.name}/client`,{waitUntil: 'load', timeout: 0});
    await delay(2000);
    
    sessions.set(userId, { page });
    res.json(data);

    } catch (err) {
        console.error('Error creando sesión:', err);
        res.status(500).json({ success: false, error: 'Error creando sesión' });
    }
});

app.listen(port, () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
