import {AbstractController} from "./AbstractController";
import {model} from "../models/Users"

export class UsersController extends AbstractController {
    public constructor() {
        super("Users", model);
    }
}