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

}