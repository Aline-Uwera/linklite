import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';
import * as crypto from 'crypto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UrlsService {
  constructor(@InjectRepository(Url) private urlRepo: Repository<Url>) {}

  async shortenUrl(userId: number, longUrl: string): Promise<Url> {
    const shortCode = this.generateShortCode();
    const url = this.urlRepo.create({
      user: { id: userId },
      short_code: shortCode,
      long_url: longUrl,
    });
    return this.urlRepo.save(url);
  }

  async findByShortCode(shortCode: string): Promise<Url> {
    const url = await this.urlRepo.findOne({
      where: { short_code: shortCode },
    });
    if (!url) throw new NotFoundException('Short URL not found');

    url.clicks += 1;
    await this.urlRepo.save(url);
    return url;
  }
  async getUserUrls(user: User): Promise<Url[]> {
    return this.urlRepo.find({ where: { user } });
  }

  async getUrlAnalytics(shortUrl: string, user: User) {
    const url = await this.urlRepo.findOne({
      where: { short_code: shortUrl },
      relations: ['user'],
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    if (url.user.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to view this URL analytics',
      );
    }

    return {
      short_code: url.short_code,
      long_url: url.long_url,
      created_at: url.created_at,
      clicks: url.clicks,
    };
  }
  async visitShortUrl(shortUrl: string) {
    const url = await this.urlRepo.findOne({
      where: { short_code: shortUrl },
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    url.clicks += 1;
    await this.urlRepo.save(url);

    return url.long_url;
  }

  private generateShortCode(): string {
    return crypto.randomBytes(4).toString('hex');
  }
}
