import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GuestbookModule } from './guestbook/guestbook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // This makes env variables available everywhere
      envFilePath: '.env',
    }),
    GuestbookModule,
  ],
})
export class AppModule {}