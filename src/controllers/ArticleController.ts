import {AbstractController} from "./AbstractController";
import {model} from "../models/Article"

export class ArtifactController extends AbstractController {
    public constructor() {
        super("Article", model )
    }
}