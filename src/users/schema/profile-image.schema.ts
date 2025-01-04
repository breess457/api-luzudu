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

export const ImaheProfileSchema = SchemaFactory.createForClass(ProfileImage)