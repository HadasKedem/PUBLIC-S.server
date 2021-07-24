import {AbstractController} from "./AbstractController";
import {model} from "../models/Country";

export class CountryController extends AbstractController {
    public constructor() {
        super("Countries", model, user => user.isAdmin);
    }
}