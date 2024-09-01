const puppeteer = require('puppeteer');
const ExcelJS = require('exceljs');
const path = require('path');

(async () => {
    const email = 'likhan2007092@stud.kuet.ac.bd'; // Replace with your Facebook email
    const password = 'DdX0f_y+c'; // Replace with your Facebook password
    const pageLink = 'https://www.facebook.com/Mehenil'; // Replace with the page you want to scrape
    const targetPostCount = 10;

    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const [page] = await browser.pages();
    try{
        // Navigate to Facebook and log in
        await page.goto('https://www.facebook.com/', { waitUntil: 'networkidle2' });
        await page.type('#email', email);
        await page.type('#pass', password);
        await page.click('[name="login"]');

        // Wait for login to complete
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        // Navigate to the desired page
        await page.goto(pageLink, { waitUntil: 'networkidle2' });

  // Scroll down to load more posts
  const numberOfScrolls = 3; // Number of times you want to scroll down
  for (let i = 0; i < numberOfScrolls; i++) {
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for posts to load
  }

  // Click "See more" to expand texts
  await page.evaluate(() => {
    const seeMoreElements = Array.from(document.querySelectorAll('span')).filter(el => el.textContent === 'See more');
    seeMoreElements.forEach(el => el.click());
    
  });

  // Continue with scraping or other tasks
}
finally{
    await browser.close();
}
 
})();
