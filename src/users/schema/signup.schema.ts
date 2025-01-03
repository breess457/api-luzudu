import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Signup extends Document {
    @Prop({ required : true })
    firstname:string;

    @Prop({ required : true })
    lastname:string;

    @Prop({ required : true })
    phone:string;

    @Prop({ required : true })
    email:string;

    @Prop({ required : true })
    password:string;

    @Prop({ default: Date.now })
    createDate: Date;
}

export const SignupSchema = SchemaFactory.createForClass(Signup);