import {AbstractController} from "./AbstractController";
import {model} from "../models/BreakingNews"

export class ScrappingController extends AbstractController {
    public constructor() {
        super("BreakingNews", model);
    }
}