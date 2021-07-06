import {AbstractController} from "./AbstractController";
import {model} from "../models/Article"

export class ArticleController extends AbstractController {
    public constructor() {
        super("Article", model )
    }
}