// Based on https://github.com/checkly/puppeteer-examples/blob/master/3.%20login/google_social.js
const puppeteer = require("puppeteer");
const dotenv = require('dotenv');

dotenv.config();

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    // To remove the executablePath, follow the instructions here:
    // https://github.com/GoogleChrome/puppeteer/issues/4752
    // executablePath:
      // "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1000, height: 700 })
  await page.goto("http://localhost:8000/hello");
  
  await page.waitForSelector(".idme-signin")
  await page.click('.idme-signin');
  
  // id.me credentials
  const navigationPromise = await page.waitForNavigation();
  await page.type("#user_email", process.env.USER);
  await page.type("#user_password", process.env.PW);
  await page.click("input[type='submit']");

  // 2FA select
  await navigationPromise;
  await page.click("button[type='submit']");
  
  // 2FA code input
  await navigationPromise
  await page.click("button[type='submit']");

  // Redirect back to SP post-authentication
  await page.waitForResponse('http://localhost:8000/hello')

  await browser.close();
})();
