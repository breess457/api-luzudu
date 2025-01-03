import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor( private configService:ConfigService ){}
  getDatabaseUrl():string{
    return this.configService.get<string>('DATABASE_URL')
  }
  getJwtSecret():string{
    return this.configService.get<string>('JWT_SECRET')
  }
  getPort():number{
    return this.configService.get<number>('PORT')
  }
  getHello(): string {
    return 'Hello World!';
  }
}
