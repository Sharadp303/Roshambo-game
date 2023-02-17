import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './game.gateway/events.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/Game'),
    AuthModule,EventsModule],
  controllers: [],
  providers: []
})
export class AppModule {}
