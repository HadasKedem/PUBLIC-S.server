const rp = require('request-promise');
const cheerio = require('cheerio');
const BreakingNewsModel = require("../models/BreakingNews")
const jpost_breaking_news = "https://www.jpost.com/breaking-news";


module.exports = {
    connectToJPost: function () {
        return new Promise((resolve, reject) => {
            rp(jpost_breaking_news)
                .then(function (html:String) {
                    let $ = cheerio.load(html);
                    let newsArray = $(".breaking-news-link-container")
                    let news = newsArray
                        .get()
                        .map((item:any) => item.children[1].children)
                        .map((item:any) => new BreakingNewsModel({
                            content:item[1].children[0]["data"],
                            author:item[3].children[1].children[0]["data"].replace("By ", ""),
                            date:item[3].children[3].children[0]["data"]
                        }))
                    resolve(news)
                })
                .catch(function (err: { toString: () => any; }) {
                    //handle error
                    reject(err.toString())
                });
        });
    }
}