import { Test, TestingModule } from '@nestjs/testing';
import { LivresController } from './livres.controller';

describe('LivresController', () => {
  let controller: LivresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LivresController],
    }).compile();

    controller = module.get<LivresController>(LivresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
