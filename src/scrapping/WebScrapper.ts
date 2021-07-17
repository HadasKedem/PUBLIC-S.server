const rp = require('request-promise');
const cheerio = require('cheerio');
const jpost_breaking_news = "https://www.jpost.com/breaking-news";


export function connectToJPost() : Promise<{ content: string, author: string, date: string }[]> {
    return new Promise((resolve, reject) => {
        rp(jpost_breaking_news)
            .then(function (html: any) {

                let $ = cheerio.load(html);
                let newsArray = $(".breaking-news-link-container")
                let news: any[] = []
                newsArray
                    .get()
                    .map((item: { children: { children: any; }[]; }) => item.children[1].children)
                    .map((item: { children: { data: null, children: { [x: string]: any; }[]; }[]; }[]) => {
                        let newsJson = {
                            content: null,
                            author: null,
                            date: null
                        };
                        newsJson.content = item[1].children[0]["data"];
                        if (0 in item[3].children[1].children) {
                            newsJson.author = item[3].children[1].children[0]["data"].replace("By ", "");
                        } else {
                            // @ts-ignore
                            newsJson.author = "JERUSALEM POST";
                        }
                        newsJson.date = item[3].children[3].children[0]["data"];
                        return newsJson
                    })
                    .forEach((item: any) => news.push(item))
                resolve(news)
            })
            .catch(function (err: any) {
                //handle error
                reject(err.toString())
            });
    });
}