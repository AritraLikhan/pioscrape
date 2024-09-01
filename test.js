let text = `Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Tanvir Ahmad Arjel 
S
o
e
p
r
d
o
t
n
s
0
5
0
l
h
:
M
2
1
4
3
7
8
f
1
t
a
c
1 
9
0
2
3
c
a
y
u
1 
l
a
5
1
2 
l
P
6
7
J
c
a
3
6
i
h
t
1 
 
 · 
এই আন্দোলন আমাকে কতটা প্রভাবিত করছে তার জ্বলন্ত প্রমাণ হচ্ছে নিচের এই ছবিটা!
গত ৬০০ দিনে আমি একদিনও প্রবলেম সল্ভিং মিস করি নাই! এর ভিতরে ঈদ গেছে, অনেক ট্যুর গেছে, অসুস্থতা গেছে কিন্তু এর ভিতরেও প্রতিদিন প্রবলেম সল্ভ করছি আলহামদুলিল্লাহ!
কিন্তু গত এক সপ্তাহেই ৪ দিন মিস করছি! প্রবলেম সল্ভ করতে একটুও মন চায় নাই! বার বার মনে হইছে আমার ছোট ছোট ভাই-বোনগুলোকে হাসিনা মে/রে ফেলতেছে আর এই অবস্থায় আমি নিজের ক্যারিয়ার নিয়ে ব্যস্ত! এর চেয়ে স্বার্থপরতা আর কিছুই হতে পারে না!… See more
See Translation
All reactions:
10K
10K
216 comments
216 shares
Like
Comment
Send
Share
View more comments
Nusrat Tabassum
আপনারে লাল সালাম 
2w
Like
Reply
See translation




Comment as Megumi Haruko
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook
Facebook`;

let firstPeriodIndex = text.indexOf(" · "); // Find the index of the first " · "
let allReactionsIndex = text.indexOf("All reactions"); // Find the index of "All reactions"

if (firstPeriodIndex !== -1) {
    let result = text.substring(firstPeriodIndex); // Extract text from the first " · " to the end
    if (allReactionsIndex !== -1) {
        result = result.substring(0, result.indexOf("All reactions")).trim(); // Remove everything after "All reactions"
    }
    console.log(result);
} else {
    console.log("No period found in the text.");
}
