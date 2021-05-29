const rp = require('request-promise');
const cheerio = require('cheerio');
const jpost_breaking_news = "https://www.jpost.com/breaking-news";


module.exports = {
    connectToJPost: function () {
        return new Promise((resolve, reject) => {
            rp(jpost_breaking_news)
                .then(function (html) {
                    // const list = cheerio.load(html)
                    //     .find('html > body > div > div > div > div')
                    //     .toArray()
                    //     .map(element => $(element).attr('title'))
                    //     .forEach(item => {
                    //         console.log(item)
                    //     })//success!
                    // resolve("see log");

                    let $ = cheerio.load(html);
                    let newsArray = $(".breaking-news-link-container")
                    let news = []
                    newsArray
                        .get()
                        .map(item => item.children[1].children)
                        .map(item => {
                            let newsJson = new Object();
                            newsJson.content = item[1].children[0]["data"];
                            newsJson.author = item[3].children[1].children[0]["data"].replace("By ", "");
                            newsJson.date = item[3].children[3].children[0]["data"];
                            return newsJson
                        })
                        .forEach(item => news.push(item))
                    resolve(news)
                })
                .catch(function (err) {
                    //handle error
                    reject(err.toString())
                });
        });
    }
}
