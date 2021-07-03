import {AbstractController} from "./AbstractController";
import {model} from "../models/Users"
import {Router} from "express";
import {login, fetchUserByToken} from "../BL/AuthenticationHandler"

export class UsersController extends AbstractController {
    public constructor() {
        super("Users", model);
    }

    public createRouter():Router {
        let router:Router = super.createRouter();
        router.post("/Users/login", this.performLogin)
        router.post("/Users/whoami", this.checkLoggedUser)
        return router;
    }

    public performLogin = (req:any, res:any) => {
        let username = req.body.username;
        let pass = req.body.password;
        login(username, pass).then(token=>{
            res.status(200).json(token)
        }).catch(error => {
            res.status(401).json(error)
        })
    }

    public checkLoggedUser = (req:any, res:any) => {
        if (req.headers && req.headers.authorization) {
            let authorization = req.headers.authorization
            fetchUserByToken(authorization)
                .then(user => {
                    res.status(200).json(user)
                })
                .catch(error => {
                    res.status(401).json(error)
                })
        } else {
            res.status(401).json("No authorization token found in header")
        }
    }
}