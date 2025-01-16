import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserAccount, CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';;
import { Response } from 'express';
import {config} from 'dotenv'
import { JwtAuthGuard } from './AuthGuard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {diskStorage} from "multer";
import { extname } from 'path';
config()


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService:JwtService
  ) {}

  @Post('signup')
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough:true }) response:Response
  ) {
    console.log(createUserDto)
    try{
      const createUser = await this.usersService.signup(createUserDto)
      if(createUser){
        const token = this.jwtService.sign(
          {id:createUser.id, email:createUser.email, firstname:createUser.firstname}
        )
        const expires = new Date();
        response.cookie('Authentication',token,{
          secure:true,
          httpOnly:true,
          expires
        })

        return {
          statusCode:201,
          message:"create user success fully",
          nameuser:createUser.firstname,
          token:token
        }
      }else{
        console.log("have user")
        return {
          statusCode:409,
          message:"have user"
        }
      }
    }catch(e){
      console.log(e)
    }
  }

  @Post('login')
  async login(@Body()loginUserDto:LoginUserDto,@Res({ passthrough:true }) response:Response){
    try{
      const getUser = await this.usersService.login(loginUserDto)
      if(getUser){
        const token = this.jwtService.sign(
          {id:getUser.id,email:getUser.email,firstname:getUser.firstname},
        )
        const expires = new Date();
        response.cookie('Authentication',token,{
          secure:false,
          httpOnly:true,
          sameSite: 'lax',
          expires
        })
        return {
          statusCode:201,
          message:"login success fully",
          nameuser:getUser.firstname,
          token:token
        }
      }else{
        return{
          statusCode:409,
          message:'Email or password is incorrect.'
        }
      }
    }catch(e){
      console.log(e)
    }
  }

  
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
        const getProfile = await this.usersService.findByUser(req.user);
        const getAccount = await this.usersService.findByAccount(req.user)
        const getImage = await this.usersService.findImageAccount(req.user)
        if(getProfile){
          return {
            statusCode: 200,
            message: 'Profile retrieved successfully',
            data: {Profile:getProfile,Account:getAccount,Photo:getImage}
          }
        }else{
           console.log("none profile")
        }
  };
  
  @Post('manage-account')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file',{
      storage:diskStorage({
        destination:"./upload/profile",
        filename:(req, file,callback)=>{
          const uniqueSuffix = Date.now()+ '-' + Math.round(Math.random()* 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null,filename)
        }
      }),
      fileFilter:(req, file,callback)=>{
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new Error(`Only image files are allowed!`),false)
        }
        callback(null,true)
      }
    })
  )
  async uploadImageProfile(@UploadedFile() file:Express.Multer.File, @Body() createUserAccountDto:CreateUserAccount , @Req() req){
      console.log("manage-account")
      const savedImage = await this.usersService.saveImageData(file,req.user)
      const saveAccountData = await this.usersService.editByAccount(req.user,createUserAccountDto)
    return {
      statusCode:201,
      message:"File Upload Successfully",
      accountData:saveAccountData,
      image:savedImage
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
