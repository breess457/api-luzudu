import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule,ConfigService } from '@nestjs/config';
import {ServeStaticModule} from "@nestjs/serve-static"
import { join } from 'path';

@Module({
  imports: [
  
    ConfigModule.forRoot({
        isGlobal:true,
        envFilePath:'.env'
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    ServeStaticModule.forRoot({
      rootPath:join(__dirname,'..','uploads'),
      serveRoot:'/uploads'
    }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService,ConfigService],
})
export class AppModule {}
