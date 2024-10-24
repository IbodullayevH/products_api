import { NestFactory } from '@nestjs/core';
import { AppModule } from './apps/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService)
  const port = configService.get<number>('SERVER_PORT') || 3001
  await app.listen(
    port, () => {
      console.log(`http://localhost:${port}`)
    }
  );
}
bootstrap();
