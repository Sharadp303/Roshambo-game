import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { PlayerModule } from './roshambo/player.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/Game'),
    AuthModule,PlayerModule,EmailModule],
  controllers: [],
  providers: []
})
export class AppModule {}
