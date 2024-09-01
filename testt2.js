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
    const page = (await browser.pages())[0]; // Corrected this line

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
        let seenPosts = new Set(); // Use a Set to avoid duplicates

        while (posts.length < targetPostCount) {
            // Scrape text posts and their links
            let postElements = await page.evaluate(() => {
                const postData = [];
                const postDivs = document.querySelectorAll('div.x1yztbdb.x1n2onr6.xh8yej3.x1ja2u2z');

                postDivs.forEach(el => {
                    // Extract post text and link
                    let postText = el.innerText.trim();
                    let linkElement = el.querySelector('a[href*="/posts/"]');
                    let postLink = linkElement ? linkElement.href : null;

                    if (postText !== '' && postLink) {
                        postData.push({ postText, postLink });
                    }
                });

                return postData;
            });

            for (let post of postElements) {
                if (!seenPosts.has(post.postLink)) {
                    seenPosts.add(post.postLink);

                    // Navigate to the post page
                 //   await page.goto(post.postLink, { waitUntil: 'networkidle2' });

                    // Extract the final URL and text on the post page
                 //   let finalURL = await page.url();
                    let postText = await page.evaluate(() => document.querySelector('div[data-ad-comet-preview="message"]').innerText);

                 //   posts.push({ postText, postLink: finalURL });
                //    console.log(finalURL); // Display the final link in the console

                    // Navigate back to the timeline
                //    await page.goBack({ waitUntil: 'networkidle2' });
                }
            }

            if (posts.length >= targetPostCount) break;

            // Scroll down to load more posts
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            await new Promise(resolve => setTimeout(resolve, 10000));  // Wait for posts to load
        }

        // Save posts to an Excel file
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet('Posts');
        worksheet.columns = [
            { header: 'Post Text', key: 'text', width: 100 },
            { header: 'Link', key: 'link', width: 50 }
        ];

        posts.forEach(post => {
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
