import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import {config} from 'dotenv'
import { JwtAuthGuard } from './AuthGuard/jwt-auth.guard';
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
    console.log("profile")
        const getProfile = await this.usersService.findByUser(req.user);
        if(getProfile){
         console.log("1 : ",getProfile)
          return {
            statusCode: 200,
            message: 'Profile retrieved successfully',
            data: getProfile
          }
        }else{
           console.log("none profile")
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
