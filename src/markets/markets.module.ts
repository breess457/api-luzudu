import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { MarketsController } from './markets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotoSupperMarketSchema, SupperMarketSchema } from './schema/market.schema';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
config()

@Module({
  imports:[
    // JwtModule.register({
    //   secret:process.env.JWT_SECRET,
    //   signOptions:{expiresIn:'1d'}
    // }),
    MongooseModule.forFeature([
      {name:"SupperMarket",schema:SupperMarketSchema},
      {name:"PhotoSupperMarket",schema:PhotoSupperMarketSchema}
    ])
  ],
  controllers: [MarketsController],
  providers: [MarketsService],
})
export class MarketsModule {}
