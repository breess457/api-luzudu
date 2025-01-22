import { Injectable } from '@nestjs/common';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { PhotoSupperMarket, SupperMarket } from './schema/market.schema';
import * as path from 'path';
import * as fs from "fs"
import { InjectModel, } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payload } from 'src/users/dto/create-user.dto';
import { unlinkSync } from 'fs';

@Injectable()
export class MarketsService {
  private readonly uploadPhotoMarketPath = path.join(__dirname,'../../upload/photomarket')
  constructor(
    @InjectModel(SupperMarket.name) private supperMarketModel:Model<SupperMarket>,
    @InjectModel(PhotoSupperMarket.name) private photoSupperMarketModel:Model<PhotoSupperMarket>
  ){}

  async createSupperMarket(payload:Payload,createMarketDto: CreateMarketDto):Promise<{}> {
    console.log("ft")
    try{
      const findAccountMarket = await this.supperMarketModel.findOne({userProfileId:payload.id}).exec()

      if(findAccountMarket){
          const editAccountMarket = await this.supperMarketModel.updateOne(
            {userProfileId:payload.id,},
            {
              nameMarket:createMarketDto.namemarket,
              locationMarket:createMarketDto.locationmarket
            },
            { new: true }
          );
          console.log("edit success")
        return {statusCode:200,typed:"update",editAccountMarket};
      }
      const createAccountMarket = new this.supperMarketModel({
          userProfileId:payload.id,
          nameMarket:createMarketDto.namemarket,
          locationMarket:createMarketDto.locationmarket
      })
      console.log("create success",createAccountMarket)
      return {
        statusCode:200,
        type:"create",
        data:await createAccountMarket.save()
      }
    }catch(e){
      console.error(`Is Error : ${e}`)
    }
  }

  async findAll(payload:Payload):Promise<SupperMarket> {
    const result = await this.supperMarketModel.findOne({userProfileId:payload.id}).exec()
    return result
  }

  async uploadImageSuperMarket(payload:Payload,files:any,datatrast:any):Promise<PhotoSupperMarket | {}>{
      const existingRecord = await this.photoSupperMarketModel.findOne({userProfileId:payload.id})
      if(!files.marketimages && !datatrast?.datawilltrash){
        console.log("not delete")
        return {statusCode:300,message:"not delete not update"}
      }
        if(datatrast?.datawilltrash && datatrast?.datawilltrash.length > 0){
            datatrast?.datawilltrash.forEach(async(imageMarket:any)=>{
              const  fullPath = path.join(__dirname,'../../upload/photomarket/', path.basename(imageMarket))
              try{
                const trashData = await this.photoSupperMarketModel.updateOne(
                  {userProfileId:payload.id},
                  {$pull:{picMarket:{filename:imageMarket}}}
                )
                if(trashData){
                  fs.unlinkSync(fullPath)
                }
              }catch(e){
                console.error(`Failed to delete image : ${fullPath}`, e)
              }
            })
            if(!files.marketimages){
              console.log("toast")
              return {statusCode:201,message:"delete image success"}
            }
        }
        if(files.marketimages){
            const newImageDocs:any = files.marketimages.map((file:any)=>({
              filename:file.filename,
              path:file.path,
              mimetype:file.mimetype
            }));
          
            if(existingRecord){
                existingRecord.picMarket.push(...newImageDocs)
                return {statusCode:201,message:"update upload imgage success", data:existingRecord.save()}
            }
          
            const uploadMarket = new this.photoSupperMarketModel({
              userProfileId:payload.id,picMarket:newImageDocs
            })
            
            return {statusCode:201,message:"update image success", data:uploadMarket.save()}
        }
  }

  async getImageMarket(payload:Payload):Promise<PhotoSupperMarket | {}>{
      const findImage = await this.photoSupperMarketModel.findOne({userProfileId:payload.id})
      if(findImage){
        return findImage
      }
      return {picMarket:[]}
  }

  update(id: number, updateMarketDto: UpdateMarketDto) {
    return `This action updates a #${id} market`;
  }

  remove(id: number) {
    return `This action removes a #${id} market`;
  }
}
