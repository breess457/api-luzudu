import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SignupSchema } from './schema/signup.schema';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { JwtStragy } from './AuthGuard/jwt.strategy';
import { ImaheProfileSchema } from './schema/profile-image.schema';
config()

@Module({
  imports:[
    JwtModule.register({
      secret:process.env.JWT_SECRET,
      signOptions:{expiresIn:'1d'}
    }),
    MongooseModule.forFeature([
      {name:'Signup', schema:SignupSchema},
      {name:'ProfileImage',schema:ImaheProfileSchema}
    ]),
    PassportModule
  ],
  controllers: [UsersController],
  providers: [UsersService,JwtStragy],
})
export class UsersModule {}
