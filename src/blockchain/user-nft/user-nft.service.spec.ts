import { Test, TestingModule } from '@nestjs/testing';
import { UserNftService } from './user-nft.service';

describe('UserNftService', () => {
  let service: UserNftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserNftService],
    }).compile();

    service = module.get<UserNftService>(UserNftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
