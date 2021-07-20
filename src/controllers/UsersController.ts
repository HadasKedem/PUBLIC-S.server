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
        router.get("/Users/name/:_partialWriterName", this.filterUserByPartOfName)
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


    public filterUserByPartOfName = (req:any, res:any) => {
        let partialUserName = req.params["_partialWriterName"]
        let partialMatchRegex = ('^' + partialUserName + '*').toString()
        let nameFilter = {
            $or: [
                {firstName: {$regex: partialMatchRegex, $options: "i"}},
                {lastName: {$regex: partialMatchRegex, $options: "i"}}
            ]
        }
        this.model.find(nameFilter, (err, user) => {
            if (err) {
                return res.status(400).json({error: err.error})
            } else {
                return res.status(200).json(user)
            }
        });
    }
}