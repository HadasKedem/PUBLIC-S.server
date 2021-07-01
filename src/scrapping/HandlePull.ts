import {db} from "../DAL/database";

export function handlePull (news: {content: string, author: string, date: string}[]) {
    let collection = db.collection("breakingnews")
    news.forEach(n => {
        collection.countDocuments({"content": n.content}).then((value: number) =>{
            if(value == 0) {
                console.log("breaking news: " + n.content)
                collection.insertOne(n).finally()
            }
        } )
    })
}