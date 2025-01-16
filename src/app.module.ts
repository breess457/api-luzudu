import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule,ConfigService } from '@nestjs/config';
import {ServeStaticModule} from "@nestjs/serve-static"
import { join } from 'path';
import { MarketsModule } from './markets/markets.module';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
config()

@Module({
  imports: [
    JwtModule.register({
      secret:process.env.JWT_SECRET,
      signOptions:{expiresIn:'1d'}
    }),
    ConfigModule.forRoot({
        isGlobal:true,
        envFilePath:'.env'
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    ServeStaticModule.forRoot({
      rootPath:join(__dirname,'..','upload'),
      serveRoot:'/upload'
    }),
    UsersModule,
    MarketsModule
  ],
  controllers: [AppController],
  providers: [AppService,ConfigService],
})
export class AppModule {}
