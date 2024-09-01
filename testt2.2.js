const puppeteer = require('puppeteer');
const ExcelJS = require('exceljs');
const path = require('path');

// Function to create a new tab with retry logic and ensure tab closure on error
const createNewTab = async (browser, retries = 3) => {
    while (retries > 0) {
        let tab;
        try {
            tab = await browser.newPage();
            return tab;
        } catch (error) {
            console.error('Error creating a new tab:', error.message);
            retries -= 1;
            if (tab) await tab.close(); // Ensure any opened tab is closed if there's an error
            if (retries === 0) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retrying
        }
    }
};

// Function to introduce variable delays
const randomDelay = (min = 1000, max = 5000) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

(async () => {
    const email = 'likhan2007092@stud.kuet.ac.bd'; // Replace with your Facebook email
    const password = 'DdX0f_y+c'; // Replace with your Facebook password
    const pageLink = 'https://www.facebook.com/Mehenil'; // Replace with the page you want to scrape
    const targetPostCount = 10;

    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const [page] = await browser.pages();

    try {
        // Navigate to Facebook and log in
        await page.goto('https://www.facebook.com/', { waitUntil: 'networkidle2' });
        await page.type('#email', email);
        await page.type('#pass', password);
        await page.click('[name="login"]');

        // Wait for login to complete
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        // Navigate to the desired page
        await page.goto(pageLink, { waitUntil: 'networkidle2' });

        let posts = [];
        let seenPosts = new Set();

        while (posts.length < targetPostCount) {
            // Scrape text posts and links
            let postElements = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('div.x1yztbdb.x1n2onr6.xh8yej3.x1ja2u2z'))
                    .map(el => {
                        let postText = el.innerText.trim();
                        let linkElement = el.querySelector('a[href*="/posts/"]');
                        let postLink = linkElement ? linkElement.href : null;
                        return { postText, postLink };
                    })
                    .filter(post => post.postText !== '' && post.postLink);
            });

            for (let post of postElements) {
                if (!seenPosts.has(post.postLink)) {
                    seenPosts.add(post.postLink);

                    // Introduce a random delay before opening a new tab
                    await new Promise(resolve => setTimeout(resolve, randomDelay()));

                    // Create a new tab with retry logic
                    const tab = await createNewTab(browser);
                    try {
                        await tab.goto(post.postLink, { waitUntil: 'networkidle2' });

                        // Extract text from the new tab
                        let postDetails = await tab.evaluate(() => {
                            let postText = document.body.innerText;
                            return { postText };
                        });

                        // Add to posts list
                        posts.push({
                            postText: postDetails.postText.trim(),
                            postLink: post.postLink
                        });

                        console.log(post.postLink); // Display the link in the console
                    } catch (error) {
                        console.error('Error processing post:', error.message);
                    } finally {
                        await tab.close(); // Ensure the tab is closed after processing
                    }

                    if (posts.length >= targetPostCount) break;
                }
            }

            if (posts.length >= targetPostCount) break;

            // Scroll down to load more posts
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for posts to load
        }

        // Convert to Array and limit to the target post count
        posts = posts.slice(0, targetPostCount);

        // Save posts to an Excel file
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet('Posts');
        worksheet.columns = [
            { header: 'Post Text', key: 'text', width: 100 },
            { header: 'Link', key: 'link', width: 50 }
        ];

        posts.forEach(post => {
            let firstPeriodIndex = post.postText.indexOf(" · ");
            let allReactionsIndex = post.postText.indexOf("All reactions");

            if (firstPeriodIndex !== -1) {
                post.postText = post.postText.substring(firstPeriodIndex);
                if (allReactionsIndex !== -1) {
                    post.postText = post.postText.substring(0, post.postText.indexOf("All reactions")).trim();
                }
            }

            worksheet.addRow({
                text: post.postText,
                link: post.postLink
            });
        });

        await workbook.xlsx.writeFile(path.join(__dirname, 'facebook_posts.xlsx'));
        console.log('Posts saved to facebook_posts.xlsx');

    } finally {
        await browser.close();
    }
})();
