import {AbstractController} from "./AbstractController";
import {model} from "../models/BreakingNews"
import {Router} from "express";
const AhoCorasick =require('ahocorasick');

export class ScrappingController extends AbstractController {
    public constructor() {
        super("BreakingNews", model, () => false);
    }

    createRouter(): Router {
        let router = super.createRouter();
        router.get("/BreakingNews/q/:words", this.findBy)
        return router
    }

    public findBy = async (req: any, res: any) => {
        let words = req.params["words"].split(',').map((s: String) => s.toLowerCase())
        await model.find((err: any, documents: Document[]) => {
            if (err) {
                res.status(400).json(err)
            } else {
                const ac = new AhoCorasick(words);
                // @ts-ignore
                res.status(200).json(documents.filter(d => ac.search(d.toObject().content.toLowerCase()).length > 0))

            }
        })

    }
}