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
        return router;
    }

    public articleByField = async (req:any , res: any) => {
        let filter = [{
            $group: {
                _id: "$field",
                count: {
                    $sum: 1
                }
            }
        }]
        await this.model.aggregate(filter, (err:any, answer:any) => {
            if (err) {
                return res.status(400).json({error: err.error})
            } else {
                return res.status(200).json(answer)
            }
        });

    }

}