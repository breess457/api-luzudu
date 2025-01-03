import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule,ConfigService } from '@nestjs/config';

@Module({
  imports: [
  
    ConfigModule.forRoot({
        isGlobal:true,
        envFilePath:'.env'
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService,ConfigService],
})
export class AppModule {}
