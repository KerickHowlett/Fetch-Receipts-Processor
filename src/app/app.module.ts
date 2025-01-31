import { Module } from '@nestjs/common';

import { ReceiptsModule } from 'src/receipts/receipts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [ReceiptsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
