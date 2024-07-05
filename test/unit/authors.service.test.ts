import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from '../../src/modules/authors/authors.service';
import { AuthorsRepositoryInterface } from '../../src/modules/authors/interfaces/authors-repository.interface';
import { RedisService } from '../../src/modules/redis/redis.service';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let redisService: RedisService;
  let authorsRepository: AuthorsRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: RedisService,
          useValue: {
            del: jest.fn().mockResolvedValue(undefined),
            set: jest.fn().mockResolvedValue(undefined),
            get: jest.fn().mockResolvedValue(undefined),
          }
        },
        {
          provide: 'AuthorsRepositoryInterface',
          useValue: {
            createAuthor: jest.fn().mockResolvedValue({}),
            findOneAuthor: jest.fn().mockResolvedValue({}),
            findAllAuthors: jest.fn().mockResolvedValue([]),
            updateAuthor: jest.fn().mockResolvedValue({}),
            deleteAuthor: jest.fn().mockResolvedValue({}),
          }
        }
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    redisService = module.get<RedisService>(RedisService);
    authorsRepository = module.get<AuthorsRepositoryInterface>('AuthorsRepositoryInterface');
  });

  function testRedisDelOnMethodCall(methodName, ...args) {
    it(`should call redis.del when ${methodName} is called`, async () => {
      const spy = jest.spyOn(redisService, 'del');

      await service[methodName](...args);

      expect(spy).toBeCalled();
    });
  }

  function testFindOneAuthorOnMethodCall(methodName, ...args) {
    it(`should call findOneAuthor when ${methodName} is called`, async () => {
      const findOneAuthorSpy = jest.spyOn(service, 'findOneAuthor');

      await service[methodName](...args);

      expect(findOneAuthorSpy).toBeCalled();
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  testRedisDelOnMethodCall('createAuthor', {} as any, 1);
  testRedisDelOnMethodCall('updateAuthor', 1, {} as any, {} as any);
  testRedisDelOnMethodCall('deleteAuthor', 1, {} as any);

  testFindOneAuthorOnMethodCall('updateAuthor', 1, {} as any, {} as any);
  testFindOneAuthorOnMethodCall('deleteAuthor', 1, {} as any);

  it('should call redis.set and redis.get when findAllAuthors is called', async () => {
    const setSpy = jest.spyOn(redisService, 'set');
    const getSpy = jest.spyOn(redisService, 'get');

    await service.findAllAuthors();

    expect(setSpy).toBeCalled();
    expect(getSpy).toBeCalled();
  });
});
