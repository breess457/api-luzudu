import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { CreateMarketDto, MarketImagDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { JwtAuthGuard } from 'src/users/AuthGuard/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findMarket(@Req() req) {
    return this.marketsService.findAll(req.user);
  }

  @Post('manage')
  @UseGuards(JwtAuthGuard)
  async createMarket(@Req() req,@Body() createMarketDto: CreateMarketDto) {
    return await this.marketsService.createSupperMarket(req.user,createMarketDto);
  }

  @Post('uploadimagemarket')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
      FileFieldsInterceptor([
        {name:'marketimages', maxCount:10},
      ],
      {storage:diskStorage({
          destination:"./upload/photomarket",
          filename:(req, file, callback)=>{
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
  async uploadImageMarket(@Req() req, @Body() datatrast:[],@UploadedFiles() files:Array<Express.Multer.File> ){
      console.log(datatrast)
      const IsUploadPicMarket = await this.marketsService.uploadImageSuperMarket(req.user, files, datatrast)
      return IsUploadPicMarket
  }

  @Get('getpicmarket')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req) {
    return this.marketsService.getImageMarket(req.user)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto) {
    return this.marketsService.update(+id, updateMarketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketsService.remove(+id);
  }
}
