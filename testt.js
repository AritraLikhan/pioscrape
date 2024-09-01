const puppeteer = require('puppeteer');
const ExcelJS = require('exceljs');
const path = require('path');

(async () => {
    const email = 'likhan2007092@stud.kuet.ac.bd'; // Replace with your Facebook email
    const password = 'DdX0f_y+c'; // Replace with your Facebook password
    const pageLink = 'https://www.facebook.com/Mehenil'; // Replace with the page you want to scrape
    // const duration = 60000; // Scraping duration in milliseconds (e.g., 60000 ms = 60 seconds)
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
         // Use a Set to avoid duplicates

        while (posts.length < targetPostCount) {
            // Scrape text posts
              // Click "See more" links within post texts
            //   await page.evaluate(() => {
            //     document.querySelectorAll('div[role="feed"] div[dir="auto"] span[role="button"]').forEach(button => {
            //         if (button.innerText.includes('See more')) {
            //             button.click();
            //         }
            //     });
            // });


            // Wait for the content to expand
              // Wait for the content to expand
           //   await new Promise(resolve => setTimeout(resolve, 4000));

            // Scrape text posts
            let postElements = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('div.x1yztbdb.x1n2onr6.xh8yej3.x1ja2u2z'))
                    .map(el => 
                        {
                        let postText = el.innerText.trim();
                        let linkElement = el.querySelector('a[href*="/posts/"]');
                        let postLink = linkElement ? linkElement.href : null;
                        return { postText, postLink };

                        })
                        .filter(post => post.postText !== '' && post.postLink);
            });

            postElements.forEach(post => {
                if (!seenPosts.has(post.postLink)) {
                    seenPosts.add(post.postLink);
                    posts.push(post);
                    console.log(post.postLink); // Display the link in the console
                }
            });
     

            if (posts.length >= targetPostCount) break;

            // Add new posts to the Set
          //  postElements.forEach(post => posts.add(post));

            // Scroll down to load more posts
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            await new Promise(resolve => setTimeout(resolve, 10000));  // Wait for posts to load
        }

        // Convert Set to Array and limit to the target post count
        posts = posts.slice(0, targetPostCount);
        // Save posts to an Excel file
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet('Posts');
        worksheet.columns = [
            { header: 'Post Text', key: 'text', width: 100 },
            { header: 'Link', key: 'link', width: 50 }
        ];

        posts.forEach(post => {

            let firstPeriodIndex = post.postText.indexOf(" · "); // Find the index of the first " · "
            let allReactionsIndex = post.postText.indexOf("All reactions"); // Find the index of "All reactions"

            if (firstPeriodIndex !== -1) {
                post.postText = post.postText.substring(firstPeriodIndex); // Extract text from the first " · " to the end
            if (allReactionsIndex !== -1) {
                post.postText = post.postText.substring(0, post.postText.indexOf("All reactions")).trim(); // Remove everything after "All reactions"
                  }
   // console.log(post);
} else {
    console.log("No period found in the text.");
}


            worksheet.addRow({  
                text: post.postText,
                link: post.postLink  });
        });

        await workbook.xlsx.writeFile(path.join(__dirname, 'facebook_posts.xlsx'));
        console.log('Posts saved to facebook_posts.xlsx');

    } finally {
        await browser.close();
    }
})();
