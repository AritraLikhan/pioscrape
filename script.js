const { scrapeFacebook } = require('./facebookScraper');
const { pioScrape } = require('./pioscript');

const config = {
     email : 'your-email@example.com', // Replace with your Facebook email
     password : 'your-password', // Replace with your Facebook password
     pageLink : 'https://www.facebook.com/page-id', // Replace with the page or profile link you want to scrape
     targetPostCount : 10 // Replace with the number as many posts as you need
};

pioScrape(config).then(() => {
    console.log('Scraping complete!');
}).catch(err => {
    console.error('Error:', err);
});
