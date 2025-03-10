import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Param,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UrlsService } from './urls.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('urls')
@Controller('urls')
export class UrlsController {
  constructor(private urlService: UrlsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('shorten')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Shorten a long URL' })
  @ApiResponse({ status: 201, description: 'Short URL created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        long_url: { type: 'string', example: 'https://example.com' },
      },
    },
  })
  async shortenUrl(@Req() req, @Body('long_url') longUrl: string) {
    return this.urlService.shortenUrl(req.user.id, longUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all shortened URLs for the authenticated user',
  })
  @ApiResponse({ status: 200, description: 'List of shortened URLs' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserUrls(@Req() req) {
    const user = req.user;
    return this.urlService.getUserUrls(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('analytics/:shortUrl')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get analytics for a shortened URL' })
  @ApiResponse({
    status: 200,
    description: 'URL analytics retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Short URL not found' })
  @ApiParam({ name: 'shortUrl', required: true, example: 'abc123' })
  async getUrlAnalytics(@Param('shortUrl') shortUrl: string, @Req() req) {
    const user = req.user;
    return this.urlService.getUrlAnalytics(shortUrl, user);
  }

  @Get(':shortUrl')
  @ApiOperation({ summary: 'Redirect a shortened URL to its original URL' })
  @ApiResponse({ status: 302, description: 'Redirecting to original URL' })
  @ApiResponse({ status: 404, description: 'Short URL not found' })
  @ApiParam({ name: 'shortUrl', required: true, example: 'abc123' })
  async redirectToLongUrl(@Param('shortUrl') shortUrl: string, @Res() res) {
    try {
      const longUrl = await this.urlService.visitShortUrl(shortUrl);

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

      return res.redirect(longUrl);
    } catch {
      throw new NotFoundException('Short URL not found');
    }
  }
}
