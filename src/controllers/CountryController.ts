import {AbstractController} from "./AbstractController";
import {model} from "../models/Country";
import {Router} from "express";

export class CountryController extends AbstractController {
    public constructor() {
        super("Countries", model, () => false);
    }

    createRouter(): Router {
        let rootPath = "/Countries"
        let router = Router()
        router.get(rootPath, this.getAll)
        router.get(rootPath+"/page/:page", this.getByPage)
        router.get(rootPath + "/:_id", this.getOne)
        return router
    }
}