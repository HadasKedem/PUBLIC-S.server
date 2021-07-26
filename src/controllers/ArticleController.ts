import {AbstractController} from "./AbstractController";
import {model} from "../models/Article"
import {Router} from "express";

export class ArticleController extends AbstractController {
    public constructor() {
        super("Article", model, user => user.isWriter)
    }

    public createRouter(): Router {
        let router: Router = super.createRouter();
        router.get("/Article/group/byField", this.articleByField)
        router.get("/Article/q/averageWords", this.averageWords)
        return router;
    }

    public articleByField = async (req: any, res: any) => {
        let aggregator = [{
            $group: {
                _id: "$field",
                count: {
                    $sum: 1
                }
            }
        }]
        await this.model.aggregate(aggregator, (err: any, answer: any) => {
            if (err) {
                return res.status(400).json({error: err.error})
            } else {
                return res.status(200).json(answer)
            }
        });

    }

    public averageWords = async (req: any, res: any) => {
        await this.model.find((err: any, documents: Document[]) => {
            if (err) {
                res.status(400).json(err);
            } else {
                this.model.count((err: any, count: number) => {
                    if (err) {
                        res.status(400).json(err)
                    } else {
                        let average = -1

                        if (count != 0) {
                            //@ts-ignore
                            average = documents.map(d => d.toObject().content.length).reduce((a, b) => a + b) / count
                        }

                        res.status(200).json({"average": average})
                    }

                });


            }
        })
    }


    public getAll = async (req: any, res: any) => {
        let searchQuery = {}
        if (req.query.q) {
            searchQuery = {
                $text: {$search: req.query.q}
            }
        }
        await this.model.find(searchQuery).populate({ path:"writer", model:"Users" }).exec( (err, artifacts) => {
            if (err) {
                return res.status(400).json({error: err})
            } else {
                return res.status(200).json(artifacts)
            }
        })
    }
    public getByDate = async (req: any, res: any) => {
        let searchQuery = {}
        let g = new Date(req.params.year, req.params.month , req.params.day)
        let l  = new Date()
        l.setDate(g.getDate() + 1);
        if (req.params.day) {
            searchQuery = {
                createdAt: {
                    $gte: g ,
                    $lte: l
                }
            }
        }
        await this.model.find(searchQuery).populate({ path:"writer", model:"Users" }).exec((err, artifacts) => {
            if (err) {
                return res.status(400).json({error: err})
            } else {
                return res.status(200).json(artifacts)
            }
        })
    }

    public getByPage = async (req: any, res: any) => {
        let page = Number(req.params["page"])
        await this.model.find({}).populate({ path:"writer", model:"Users" }).sort({ _id: -1 }).skip(page * 10).limit(10).then(docs => {
                res.status(200).json(docs)
            },
            err => {
                res.status(400).json(err)
            })
    }


    public getOne = async (req: any, res: any) => {
        await this.model.findOne({_id: req.params["_id"]}).populate({ path:"writer", model:"Users" }).exec((err: any, article: any) => {
            if (err) {
                return res.status(400).json({error: err.reason.message})
            } else if (!article) {
                return res.status(404).json({error: "Not found Article with id: " + req.params["_id"]})
            } else {
                return res.status(200).json(article)
            }
        })
    }

}