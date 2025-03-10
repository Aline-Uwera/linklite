import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';

describe('UrlsController', () => {
  let controller: UrlsController;
  let urlService: UrlsService;
  beforeEach(async () => {
    const mockUrlService = {
      shortenUrl: jest.fn().mockResolvedValue({ shortUrl: 'abc123' }),
      getUserUrls: jest
        .fn()
        .mockResolvedValue([
          { longUrl: 'https://example.com', shortUrl: 'abc123' },
        ]),
      getUrlAnalytics: jest.fn().mockResolvedValue({ clicks: 10 }),
      visitShortUrl: jest.fn().mockResolvedValue('https://original-url.com'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [{ provide: UrlsService, useValue: mockUrlService }],
    }).compile();

    controller = module.get<UrlsController>(UrlsController);
    urlService = module.get<UrlsService>(UrlsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('shortenUrl', () => {
    it('should shorten a URL', async () => {
      const mockRequest = { user: { id: 'user1' } };
      const longUrl = 'https://example.com';

      const result = await controller.shortenUrl(mockRequest as any, longUrl);
      expect(result).toEqual({ shortUrl: 'abc123' });
      expect(urlService.shortenUrl).toHaveBeenCalledWith('user1', longUrl);
    });
  });

  describe('getUserUrls', () => {
    it('should return a list of shortened URLs', async () => {
      const mockRequest = { user: { id: 'user1' } };

      const result = await controller.getUserUrls(mockRequest as any);
      expect(result).toEqual([
        { longUrl: 'https://example.com', shortUrl: 'abc123' },
      ]);
      expect(urlService.getUserUrls).toHaveBeenCalledWith(mockRequest.user);
    });
  });

  describe('getUrlAnalytics', () => {
    it('should return URL analytics', async () => {
      const mockRequest = { user: { id: 'user1' } };
      const shortUrl = 'abc123';

      const result = await controller.getUrlAnalytics(
        shortUrl,
        mockRequest as any,
      );
      expect(result).toEqual({ clicks: 10 });
      expect(urlService.getUrlAnalytics).toHaveBeenCalledWith(
        shortUrl,
        mockRequest.user,
      );
    });
  });

  describe('redirectToLongUrl', () => {
    it('should redirect to the original URL', async () => {
      const shortUrl = 'abc123';
      const mockResponse = { redirect: jest.fn() };

      await controller.redirectToLongUrl(shortUrl, mockResponse as any);

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        'https://original-url.com',
      );
      expect(urlService.visitShortUrl).toHaveBeenCalledWith(shortUrl);
    });

    it('should throw NotFoundException if URL not found', async () => {
      const shortUrl = 'nonexistent';
      const mockResponse = { redirect: jest.fn() };

      urlService.visitShortUrl = jest
        .fn()
        .mockRejectedValue(new Error('Not Found'));

      await expect(
        controller.redirectToLongUrl(shortUrl, mockResponse as any),
      ).rejects.toThrowError('Short URL not found');
    });
  });
});
