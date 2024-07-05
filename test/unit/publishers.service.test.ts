import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '../../src/modules/redis/redis.service';
import { PublishersService } from '../../src/modules/publishers/publishers.service';
import { PublishersRepositoryInterface } from '../../src/modules/publishers/interfaces/publishers-repository.interface';

describe('PublishersService', () => {
  let service: PublishersService;
  let redisService: RedisService;
  let publishersRepository: PublishersRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublishersService,
        {
          provide: RedisService,
          useValue: {
            del: jest.fn().mockResolvedValue(undefined),
            set: jest.fn().mockResolvedValue(undefined),
            get: jest.fn().mockResolvedValue(undefined),
          }
        },
        {
          provide: 'PublishersRepositoryInterface',
          useValue: {
            createPublisher: jest.fn().mockResolvedValue({}),
            findOnePublisher: jest.fn().mockResolvedValue({}),
            findAllPublishers: jest.fn().mockResolvedValue([]),
            updatePublisher: jest.fn().mockResolvedValue({}),
            deletePublisher: jest.fn().mockResolvedValue({}),
          }
        }
      ],
    }).compile();

    service = module.get<PublishersService>(PublishersService);
    redisService = module.get<RedisService>(RedisService);
    publishersRepository = module.get<PublishersRepositoryInterface>('PublishersRepositoryInterface');
  });

  function testRedisDelOnMethodCall(methodName, ...args) {
    it(`should call redis.del when ${methodName} is called`, async () => {
      const spy = jest.spyOn(redisService, 'del');

      await service[methodName](...args);

      expect(spy).toBeCalled();
    });
  }

  function testFindOnePublisherOnMethodCall(methodName, ...args) {
    it(`should call findOnePublisher when ${methodName} is called`, async () => {
      const findOnePublisherSpy = jest.spyOn(service, 'findOnePublisher');

      await service[methodName](...args);

      expect(findOnePublisherSpy).toBeCalled();
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  testRedisDelOnMethodCall('createPublisher', {} as any, 1);
  testRedisDelOnMethodCall('updatePublisher', 1, {} as any, {} as any);
  testRedisDelOnMethodCall('deletePublisher', 1, {} as any);

  testFindOnePublisherOnMethodCall('updatePublisher', 1, {} as any, {} as any);
  testFindOnePublisherOnMethodCall('deletePublisher', 1, {} as any);

  it('should call redis.set and redis.get when findAllPublishers is called', async () => {
    const setSpy = jest.spyOn(redisService, 'set');
    const getSpy = jest.spyOn(redisService, 'get');

    await service.findAllPublishers();

    expect(setSpy).toBeCalled();
    expect(getSpy).toBeCalled();
  });
});
