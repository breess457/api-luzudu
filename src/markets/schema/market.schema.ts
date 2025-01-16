import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ _id: false }) 
export class LocationMarket extends Document{
  @Prop()
  address: string;

  @Prop()
  subdistrict: string;

  @Prop()
  district: string;

  @Prop()
  province: string;

  @Prop()
  zipcode: number;
}

const LocationMarketSchema = SchemaFactory.createForClass(LocationMarket);

@Schema()
export class SupperMarket extends Document {
    @Prop({required:true})
    userProfileId:string;

    @Prop()
    nameMarket:string

    @Prop({ type: [LocationMarketSchema],default:[] })
    locationMarket:LocationMarket

    @Prop({ default: Date.now })
    uploadedAt: Date;
}

const SupperMarketSchema = SchemaFactory.createForClass(SupperMarket);

@Schema()
export class PicMarket extends Document {
    @Prop({required:true})
    filename:string;

    @Prop()
    path: string;

    @Prop()
    mimetype: string;
}
const PicMarketSchema = SchemaFactory.createForClass(PicMarket)

@Schema()
export class PhotoSupperMarket extends Document {
    @Prop({required:true})
    userProfileId:string;
    
    @Prop({type:[PicMarketSchema],default:[]})
    picMarket:PicMarket[]

    @Prop({ default: Date.now })
    uploadedAt: Date;
}
const PhotoSupperMarketSchema = SchemaFactory.createForClass(PhotoSupperMarket)

export {SupperMarketSchema,PhotoSupperMarketSchema}