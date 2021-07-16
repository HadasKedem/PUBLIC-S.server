import {AbstractController} from "./AbstractController";
import {model} from "../models/Artifact"

export class ArtifactController extends AbstractController {
    public constructor() {
        super("Artifact", model )
    }
}