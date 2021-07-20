import {AbstractController} from "./AbstractController";
import {model} from "../models/Article"
import {Router} from "express";

export class ArticleController extends AbstractController {
    public constructor() {
        super("Article", model )
    }

    public createRouter():Router {
        let router:Router = super.createRouter();
        router.get("/Article/group/byField", this.articleByField)
        router.get("/Article/title/:_partialTitleName", this.filterArticleByTitle)
        router.get("/Article/writer/:_partialWriterName", this.filterArticleByWriter)
        return router;
    }

    public articleByField = async (req:any , res: any) => {
        let aggregator = [{
            $group: {
                _id: "$field",
                count: {
                    $sum: 1
                }
            }
        }]
        await this.model.aggregate(aggregator, (err:any, answer:any) => {
            if (err) {
                return res.status(400).json({error: err.error})
            } else {
                return res.status(200).json(answer)
            }
        });
    }

    public filterArticleByTitle = async(req:any, res:any) => {
        let partialTitleName = req.params["_partialTitleName"]
        let partialTitleMatchRegex = ('^' + partialTitleName + '*').toString()
        let titleFilter = {
            $or: [
                {title: {$regex: partialTitleMatchRegex, $options: "i"}},
                {subTitle: {$regex: partialTitleMatchRegex, $options: "i"}}
            ]
        }
        this.model.find(titleFilter, (err, article) => {
            if (err) {
                return res.status(400).json({error: err.error})
            } else {
                return res.status(200).json(article)
            }
        });

    }

    public filterArticleByWriter = (req:any, res:any) => {
        let partialWriterName = req.params["_partialWriterName"]
        let partialWriterMatchRegex = ('^' + partialWriterName + '*').toString()
        let titleFilter = {
            $or: [
                {title: {$regex: partialWriterMatchRegex, $options: "i"}},
                {subTitle: {$regex: partialWriterMatchRegex, $options: "i"}}
            ]
        }
        this.model.find(titleFilter, (err, article) => {
            if (err) {
                return res.status(400).json({error: err.error})
            } else {
                return res.status(200).json(article)
            }
        });

    }


}