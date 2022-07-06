import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';
// import { GatewayModule } from './gateway/gateway.module';
import configuration from './config/factory.config';
import { ConfigModule } from '@nestjs/config';
import { BlockchainModule } from './blockchain/blockchain.module';

@Module({
  imports: [
    AuthModule,  
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      expandVariables: true,
    }), 
    BlockchainModule,
],
  controllers: [HealthController],
})
export class AppModule {}
