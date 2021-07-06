import {Router} from "express";
import * as mongoose from "mongoose";

export abstract class AbstractController {
    private model:mongoose.Model<any>;

    protected constructor(private readonly modelName: string,
                          model: mongoose.Model<any>) {
        this.modelName = modelName
        this.model = model
    }

    public createRouter = (): Router => {
        let rootPath = "/" + this.modelName
        let router = Router()
        router.get(rootPath, this.getAll)
        router.get(rootPath + "/:_id", this.getOne)
        router.post(rootPath, this.create)
        router.delete(rootPath + "/:_id", this.delete)
        router.put(rootPath, this.update)
        return router
    }

    public getAll = async (req:any , res: any) => {
        await this.model.find({}, (err, Articles) => {
            if (err) {
                return res.status(400).json({error: err.error})
            } else {
                return res.status(200).json(Articles)
            }
        })
    }

    public getOne = async (req: any, res: any) => {
        await this.model.findOne({_id: req.params["_id"]}, (err: any, Article:any) => {
            if (err) {
                return res.status(400).json({error: err.reason.message})
            } else if (!Article) {
                return res.status(404).json({error: "Not found"  + this.modelName + " with id: " + req.params["_id"]})
            } else {
                return res.status(200).json(Article)
            }
        })
    }

    public create = async (req: any, res: any) => {
        await this.model.create(req.body, (err, Article) => {
            if(err) {
                return res.status(400).json({error: err.message})
            } else {
                return res.status(201).json(Article)
            }
        })
    }

    public delete = async(req: any, res: any) => {
        await  this.model.deleteOne({_id: req.params["_id"]}, (err) => {
            if(err) {
                return res.status(400).json({error: err.message})
            } else {
                return res.status(202).send()
            }
        })
    }

    public update = async (req: any, res: any) => {
        await this.model.updateOne({_id: req.params["_id"]}, req.body, null,(err, doc) => {
            if(err) {
                return res.status(400).json({error: err.reason.message})
            } else if(!doc.nModified) {
                return res.status(404).json({error: "Not found " + this.modelName + " with id: " + req.params["_id"]})
            } else {
                return res.status(204).send()
            }

        })
    }
}