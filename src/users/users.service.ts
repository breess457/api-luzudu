import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, LoginUserDto, Payload } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Signup } from './schema/signup.schema';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Signup.name)
    private signupModal:Model<Signup>
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
