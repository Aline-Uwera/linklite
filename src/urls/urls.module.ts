import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
@Module({
  controllers: [UrlsController],
  providers: [UrlsService],
  imports: [TypeOrmModule.forFeature([Url])],
})
export class UrlsModule {}
