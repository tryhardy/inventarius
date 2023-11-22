import 'dotenv';
import jwt from 'jsonwebtoken';

import { IUserDataForAuth } from "../controllers/auth/iuser_data_for_auth";
import { Request } from 'express';

export class JWT 
{
    protected static secret = process.env.TOKEN_SECRET;

    static generateAccessToken(payload: IUserDataForAuth|any, expires = 3600, secret = JWT.secret) {
        return jwt.sign(
            {
                //exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: payload
            }, 
            secret,
            { 
                expiresIn: expires
            }
        )
    }

    static verify(token : string, secret : string = this.secret)
    {
        try {
            return jwt.verify(token, secret);
        } 
        catch(error) {

        }
    }

    static extractToken (req : Request) : string
    {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } 
        else if (req.query && req.query.token) {
            return req.query.token;
        }

        return null;
    }
}