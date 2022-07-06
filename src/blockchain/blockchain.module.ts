import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UserNftService } from './user-nft/user-nft.service';

@Module({
  imports: [HttpModule],
  providers: [UserNftService],
  exports: [UserNftService]
})
export class BlockchainModule {}
