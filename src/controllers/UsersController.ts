import {AbstractController} from "./AbstractController";
import {model} from "../models/Users"
import {Router} from "express";
import {login, fetchUserByToken} from "../BL/AuthenticationHandler"

const mongoose = require("mongoose");
const HyperLogLog = require('../util/HyperLogLog');

var User = mongoose.model("Users");

export class UsersController extends AbstractController {
    public constructor() {
        super("Users", model, user => user.isAdmin);
    }

    public createRouter():Router {
        let router:Router = super.createRouter();
        router.post("/Users/login", this.performLogin)
        router.post("/Users/whoami", this.checkLoggedUser)
        router.get("/Users/getByEmail/:email", this.getByEmail)
        router.get("/Users/q/differentCityCount", this.countCities)
        router.post("/Users/register", this.register)
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

    public getByEmail = (req:any, res:any) => {
        console.log('inside');
        User.findOne({"email": req.params.email})
          .then((result: any) => {
            return res.status(200).send(result);
          })
          .catch((err: any) => {
            return res
              .status(400)
              .send({ error: "Error. Probably Wrong id.", err: err });
          });
      };
    public register = async (req:any, res: any) => {
        this.model.create(req.body, (err, user) => {
            if (err) {
                return res.status(400).json(err)
            } else {
                return res.status(201).json(user)
            }
        })
    }
    private countCities = (req:any, res:any) => {
        this.model.find((err: any, documents: Document[]) => {
            if(err) {
                res.status(400).json(err)
            } else {
                const hll = HyperLogLog(12);
                // @ts-ignore
                documents.map(d => d.toObject().city).filter(c => c != null).map(c => HyperLogLog.hash(c)).forEach(hll.add)

                res.status(200).json({"estimated": hll.count()})

            }
        })
    }
}