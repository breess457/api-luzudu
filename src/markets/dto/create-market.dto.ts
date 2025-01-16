import { IsNotEmpty,IsString,IsNumber } from "class-validator";
export class LocationMarketDto {
    readonly address: string;
  
    readonly subdistrict: string;
  
    readonly district: string;
  
    readonly province: string;
  
    readonly zipcode: number;
  }

class CreateMarketDto {
    @IsNotEmpty()
    readonly namemarket:string

    readonly locationmarket:LocationMarketDto
}

class ImgInMarket {
    @IsNotEmpty()
    readonly filename:string

    @IsNotEmpty()
    readonly path:string

    @IsNotEmpty()
    readonly mimetype:string
}
class MarketImagDto {
    @IsNotEmpty()
    readonly picMarket:ImgInMarket
}

export { CreateMarketDto,MarketImagDto }
