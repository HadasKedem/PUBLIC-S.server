import {AbstractController} from "./AbstractController";
import {model} from "../models/Article"
import {Router} from "express";

export class ArticleController extends AbstractController {
    public constructor() {
        super("Article", model)
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

}