import {Controller, Get, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { AppService } from './app.service';
import { CatsService } from './cats/cats.service';
import {FilesInterceptor} from "@nestjs/platform-express";
import {AwsService} from "./aws.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly awsService: AwsService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('image'))
  async uploadMediaFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return await this.awsService.uploadFileToS3('cats', file);
  }
}
