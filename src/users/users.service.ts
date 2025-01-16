import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserAccount, CreateUserDto, LoginUserDto, Payload } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Signup } from './schema/signup.schema';
import * as bcrypt from 'bcrypt'
import { ProfileAccount, ProfileImage } from './schema/account.schema';
import * as path from 'path';
import * as fs from "fs"

@Injectable()
export class UsersService {
  private readonly uploadProfilePath = path.join(__dirname,'../../upload/profile')
  constructor(
    @InjectModel(Signup.name)private signupModal:Model<Signup>,
    @InjectModel(ProfileImage.name) private profileImageModel:Model<ProfileImage>,
    @InjectModel(ProfileAccount.name) private profileAccountModel:Model<ProfileAccount>
  ){}
  async signup(createUserDto: CreateUserDto):Promise<Signup | null>{
    const checkUser = await this.signupModal.findOne({email:createUserDto.email})
    if(!checkUser){
      const newUser = new this.signupModal({
        firstname: createUserDto.firstname,
        lastname:createUserDto.lastname,
        phone:createUserDto.phone,
        email:createUserDto.email,
        password: await bcrypt.hash(createUserDto.password,10)
      })
      return newUser.save()
    }
    return null
  }

  async login(loginUserDto:LoginUserDto):Promise<Signup | null>{
    const findUser = await this.signupModal.findOne({email:loginUserDto.email})
    if(findUser && (await bcrypt.compare(loginUserDto.password, findUser.password))){
      return findUser
    }else{
      return null
    }
  }

  async findByUser(payload:Payload):Promise<Signup>{
    return await this.signupModal.findById(payload.id).select('-password').exec()
  }
  async findByAccount(payload:Payload):Promise<ProfileAccount>{
    let isAccount = await this.profileAccountModel.findOne({userProfileId:payload.id})
    if(isAccount){
      return isAccount
    }
    return null
  }
  async findImageAccount(payload:Payload):Promise<ProfileImage>{
    let isImage = await this.profileImageModel.findOne({userProfileId:payload.id}).exec()
    if(isImage){
      return isImage
    }
    return null
  }

  async saveImageData(file:Express.Multer.File,payload:Payload):Promise<ProfileImage | null | {}>{
      if(file){
        const findImg = await this.profileImageModel.findOne({userProfileId:payload.id}).exec()
        if(findImg){
          const deleteImg = await this.profileImageModel.deleteOne({filename:findImg.filename,userProfileId:payload.id})
          if(deleteImg){
            const filePath = path.join(this.uploadProfilePath,findImg.filename)
            if(!fs.existsSync(filePath)){
              throw new NotFoundException(`File ${findImg.filename} not found`)
            }

            try{
              await fs.promises.unlink(filePath)
              console.log(`Delete file:${findImg.filename} to success`)
            }catch(e){
              console.error(`Failed to delete file:${findImg.filename}`,e)
              throw new Error(`Cound not delete file:${findImg.filename}`)
            }
          }
        }
        const newImage = new this.profileImageModel({
          userProfileId:payload.id,
          filename:file.filename,
          path:file.path,
          mimetype:file.mimetype
        })
        console.log("Upload Image Success")
        return {
          statusCode:200,
          message:"upload image success fully",
          data:await newImage.save()
        }
      }else{
        console.log("Upload Image Error")
        return {
          statusCode:402,
          message:"your not upload image"
        }
      }
  }

  async editByAccount(payload:Payload,accountData:CreateUserAccount):Promise<{}>{
    
    const findAccoutn = await this.profileAccountModel.findOne({userProfileId:payload.id}).exec()
    const editFullName = await this.signupModal.findByIdAndUpdate(
      payload.id,
      {
        firstname:accountData.firstname,
        lastname:accountData.lastname
      },
      { new: true }
    );

      if(!findAccoutn){
        const newAccount = new this.profileAccountModel({
          userProfileId:payload.id,
          gender:accountData.gender,
          day:accountData.day,
          month:accountData.month,
          year:accountData.year
        });
        console.log("create account success")
        return {
          statusText:"create account",
          Account:await newAccount.save(),
          editFullname:editFullName
        }
      }else{
        const editAccount = await this.profileAccountModel.updateOne(
          {userProfileId:payload.id},
          {
            gender:accountData.gender,
            day:accountData.day,
            month:accountData.month,
            year:accountData.year
          },
          { new: true }
        )
        console.log("update account success")
        return {
          statusText:"update account",
          Account:editAccount,
          Fullname:editFullName
        }
      }
  }
 
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
