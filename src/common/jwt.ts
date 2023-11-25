import 'dotenv';
import jwt from 'jsonwebtoken';

import { IUserDataForAuth } from "../interfaces/controllers/auth/iuser_data_for_auth";
import { Request } from 'express';
import { RequestAuthData } from '../interfaces/middleware/request_auth_data';

export class JWT 
{
    protected static secret = process.env.TOKEN_SECRET;

    static generateAccessToken(payload: IUserDataForAuth|any, expires = 360000, secret = JWT.secret) {
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

    /**
     * Извлечь авторизационные данные из Headers: Bearer TOKEN
     * @param req 
     * @returns 
     */
    static getAuthDataFromHeaders(req: Request) : RequestAuthData
    {
        let token = JWT.extractToken(req); //from header "Bearer /TOKEN/"
        let data;
    
        if (token) {
            data = JWT.verify(token);
        }

        let requestAuthData : RequestAuthData = {
            authorized : data ? true : false,
            user: data ? data.data : {},
            group: data ? data.data.group : ''
        };

        return requestAuthData;
    }
}