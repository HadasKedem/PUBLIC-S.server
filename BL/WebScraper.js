const rp = require('request-promise');
const cheerio = require('cheerio');
const BreakingNewsModel = require("../models/BreakingNews")
const jpost_breaking_news = "https://www.jpost.com/breaking-news";


module.exports = {
    fetchBreakingNews: function () {
        return new Promise((resolve, reject) => {
            rp(jpost_breaking_news)
                .then(function (html) {
                    let $ = cheerio.load(html);
                    let newsArray = $(".breaking-news-link-container")
                    let array = []
                    newsArray
                        .get()
                        .map(item => item.children[1].children)
                        .map(item => new BreakingNewsModel({
                                content: item[1].children[0]["data"],
                                author: item[3].children[1].children[0]["data"].replace("By ", ""),
                                date: item[3].children[3].children[0]["data"]
                        })
                        )
                        .forEach(item => array.push(item))
                    resolve(array)
                })
                .catch(function (err) {
                    //handle error
                    reject(err.toString())
                });
        });
    }
}
