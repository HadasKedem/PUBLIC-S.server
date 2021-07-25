import {Router} from "express";
import * as mongoose from "mongoose";
import {Protocol} from "puppeteer";
import integer = Protocol.integer;
import {fetchUserByToken} from "../BL/AuthenticationHandler";

const WebSocket = require("ws")

export abstract class AbstractController {
    protected model: mongoose.Model<any>;
    private wss: any = null
    private clients = new Set()
    private readonly modifyValidator: any;

    protected constructor(private readonly modelName: string,
                          model: mongoose.Model<any>,
                          modifyValidator: (user: any) => boolean) {
        this.modelName = modelName
        this.model = model
        this.modifyValidator = modifyValidator;
    }

    public createRouter(): Router {
        let rootPath = "/" + this.modelName
        let router = Router()
        router.get(rootPath, this.getAll)
        router.get(rootPath+"/page/:page", this.getByPage)
        router.get(rootPath + "/bydate/:day/:month/:year" , this.getByDate)
        router.get(rootPath + "/:_id", this.getOne)
        router.post(rootPath, this.create)
        router.delete(rootPath + "/:_id", this.delete)
        router.put(rootPath + "/:_id", this.update)
        return router
    }

    public getAll = async (req: any, res: any) => {
        let searchQuery = {}
        if (req.query.q) {
            searchQuery = {
                $text: {$search: req.query.q}
            }
        }
        await this.model.find(searchQuery, (err, artifacts) => {
            if (err) {
                return res.status(400).json({error: err.error})
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
        await this.model.find(searchQuery, (err, artifacts) => {
            if (err) {
                return res.status(400).json({error: err.error})
            } else {
                return res.status(200).json(artifacts)
            }
        })
    }

    public getByPage = async (req: any, res: any) => {
        let page = Number(req.params["page"])
        await this.model.find({}).sort({ _id: -1 }).skip(page * 10).limit(10).then(docs => {
                res.status(200).json(docs)
            },
            err => {
                res.status(400).json(err)
            })
    }


    public getOne = async (req: any, res: any) => {
        await this.model.findOne({_id: req.params["_id"]}, (err: any, artifact: any) => {
            if (err) {
                return res.status(400).json({error: err.reason.message})
            } else if (!artifact) {
                return res.status(404).json({error: "Not found" + this.modelName + " with id: " + req.params["_id"]})
            } else {
                return res.status(200).json(artifact)
            }
        })
    }

    public create = async (req: any, res: any) => {
        fetchUserByToken(req.headers.authorization).then(user => {
                if (this.modifyValidator(user)) {
                    this.model.create(req.body, (err, artifact) => {
                        if (err) {
                            return res.status(400).json({error: err.message})
                        } else {
                            if (this.wss) {
                                this.broadcast({action: "CREATE", value: artifact})
                            }
                            return res.status(201).json(artifact)
                        }
                    })
                } else {
                    res.status(401).send()
                }
            }, () => {
                res.status(401).send()
            }
        )

    }

    public delete = async (req: any, res: any) => {
        fetchUserByToken(req.headers.authorization).then(user => {
            if (this.modifyValidator(user)) {
                this.model.findOneAndDelete({_id: req.params["_id"]}, {
                    returnOriginal: true,
                    useFindAndModify: false
                }, (err, doc) => {
                    if (err) {
                        return res.status(400).json({error: err.message})
                    }
                    if (!doc) {
                        return res.status(404).json({error: "not found"})
                    } else {
                        if (this.wss) {
                            this.broadcast({action: "DELETE", value: req.params["_id"]})
                        }
                        return res.status(202).send(doc)
                    }
                })
            } else {
                res.status(401).send()
            }
        }, () => res.status(401).send())

    }

    public update = async (req: any, res: any) => {
        fetchUserByToken(req.headers.authorization).then(user => {
            if(this.modifyValidator(user)){
                this.model.findOneAndUpdate({_id: req.params["_id"]}, { $set: req.body }, {
                    returnOriginal: false,
                    useFindAndModify: false
                }, (err, doc) => {
                    if (err) {
                        return res.status(400).json({error: err.reason.message})
                    } else if (!doc) {
                        return res.status(404).json({error: "not found"})
                    } else {
                        if (this.wss) {
                            this.broadcast({action: "UPDATE", value: doc})
                        }
                        return res.status(202).send(doc)
                    }

                })
            } else {
                res.status(401).send()
            }
        }, () => res.status(401).send())

    }

    public startWebSocket = (port: integer) => {
        if (this.wss != null) {
            console.error("WebSocket already started")
            return
        }
        this.wss = new WebSocket.Server({"port": port})
        this.wss.on("connection", (client: any) => {
            this.clients.add(client)
            client.on("message", (message: string) => {
                console.log("got message from client: \"" + message + "\"")
            })
            client.on("close", () => {
                console.log("client disconnected")
                this.clients.delete(client)
            })
        })
    }

    public closeWebSocket = () => {
        if (this.wss != null) {
            this.wss.close();
            this.clients = new Set()
            this.wss = null;
        }
    }

    protected broadcast = (message: object) => {
        const jsonMessage = JSON.stringify(message)
        this.clients.forEach((c: any) => c.send(jsonMessage))
    }
}