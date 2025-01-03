import { Injectable } from "@nestjs/common";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
import { config } from 'dotenv';
import { Payload } from "../dto/create-user.dto";
import { Request } from 'express';

config()

@Injectable()
export class JwtStragy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken() ,
            ignoreExpiration:false,
            secretOrKey:process.env.JWT_SECRET
        })
    }

    async validate(payload:Payload){
        return {id:payload.id, email:payload.email, firstname:payload.firstname}
    }
}

