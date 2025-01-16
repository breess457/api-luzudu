import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ProfileImage extends Document{
    @Prop({required:true})
    userProfileId:string;
    
    @Prop({required:true})
    filename:string;

    @Prop()
    path: string;

    @Prop()
    mimetype: string;

    @Prop({ default: Date.now })
    uploadedAt: Date;
}

@Schema()
export class ProfileAccount extends Document{
    @Prop({required:true})
    userProfileId:string;

    @Prop({required:true})
    gender:string;

    @Prop()
    day:number;

    @Prop()
    month:string;

    @Prop()
    year:number;

    @Prop({ default: Date.now })
    uploadedAt: Date;
}
const ImaheProfileSchema = SchemaFactory.createForClass(ProfileImage)
const AccountProfileSchema = SchemaFactory.createForClass(ProfileAccount)
export {ImaheProfileSchema, AccountProfileSchema}