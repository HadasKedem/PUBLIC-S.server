import {model} from "../models/Users"
let JWT_SECRET_CODE : String = "ajhdoasld";
const JsonWebToken = require("jsonwebtoken")


export function login(username:String, password:String) {

    return new Promise(function(resolve, reject) {
        if (!username || !password) {
            reject( "Either username or password is empty");
        }
        model.findOne({email:username}).then((user: any) => {
            if (!user || !user.password) {
                reject("No user exists! ");
            } else  {
                user.comparePassword(password, function (err:any, isMatch:any) {
                    if (isMatch) {
                        const token = JsonWebToken.sign({id:username}, JWT_SECRET_CODE, {expiresIn:"1h"});
                        resolve(token);
                    } else {
                        reject("Password don't match");
                    }
                })
            }
        }).catch((err:any) => {
            reject(err)
        })
    })
}

export function fetchUserByToken(token:String) {
    return new Promise((resolve, reject) => {
        try {
            let decoded = JsonWebToken.verify(token, JWT_SECRET_CODE);
            let userMail = decoded.id
            model.findOne({email:userMail}).then((user:any) =>{
                resolve(user)
            }).catch((error:any) =>{
                reject(error)
            })
        } catch (err) {
            reject(err)
        }
    });
}