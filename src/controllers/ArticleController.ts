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
    public getAll = async (req:any , res: any) => {
        let searchQuery = {}
        if (req.query.q) {
            searchQuery = {
                $text: { $search: req.query.q }
            }
        }
        // @ts-ignore
        await this.model.find(searchQuery).populate({ path:"writer", model:"Users" }).exec( (err, artifacts) => {
            if (err) {
                return res.status(400).json({error: err})
            } else {
                return res.status(200).json(artifacts)
            }
        })

    }

    public getOne = async (req: any, res: any) => {
        // @ts-ignore
        await this.model.populate({ path:"writer", model:"Users" }).findOne({_id: req.params["_id"]}, (err: any, artifact:any) => {
            if (err) {
                return res.status(400).json({error: err.reason.message})
            } else if (!artifact) {
                return res.status(404).json({error: "Not found"  + this.modelName + " with id: " + req.params["_id"]})
            } else {
                return res.status(200).json(artifact)
            }
        })
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
        let titleFilter = {
            $or: [
                {title: {$regex: partialTitleName, $options: "i"}},
                {subTitle: {$regex: partialTitleName, $options: "i"}}
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

    public filterArticleByWriter = async (req: any, res: any) => {
        let partialWriterName = req.params["_partialWriterName"]
        let titleFilter = {
            writer: {$regex: partialWriterName, $options: "i"},
        }
        let query = [
            {
                $lookup: {
                    from: "Users",
                    localField: "writer",
                    foreignField: "_id",
                    as: "writerInfo"
                }
            }, {
                 $unwind: "$writerInfo"
            }, {
                $match: {
                    $or: [
                        {"writerInfo.firstName" : {$regex: partialWriterName, $options: "i"}},
                        {"writerInfo.lastName" : {$regex: partialWriterName, $options: "i"}},
                    ]
                }
            }

        ]
        await this.model.aggregate(query).exec( (err:any, article:any) => {
            if (err) {
                return res.status(400).json({error: err.error})
            } else {
                return res.status(200).json(article)
            }
        });

    }


}