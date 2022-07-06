import { Module } from '@nestjs/common';  
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { CoreModule } from 'src/core/core.module';
import { AuthenticationController } from './contorller/authentication.controller';
import { AuthenticationService } from './service/authentication.service';


@Module({
  imports: [
    //CoreModule,
    BlockchainModule
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService]
})
export class AuthModule {}
