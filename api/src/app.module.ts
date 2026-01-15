import { Module } from '@nestjs/common'
import { AppController } from '@src/app.controller'
import { AppService } from '@src/app.service'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '@modules/auth/auth.module'
import { UsersModule } from '@modules/users/users.module'
import { PrismaModule } from '@src/database/prisma/prisma.module'
import config from '@src/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard'
import { PostsModule } from '@modules/posts/posts.module'
import { CategoriesModule } from '@modules/categories/categories.module'
import { RoleGuard } from '@modules/auth/guards/role.guard'
import { UploadModule } from '@modules/uploads/upload.module';
import { SavedPostsModule } from './modules/saved-posts/saved-posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    PostsModule,
    CategoriesModule,
    UploadModule,
    SavedPostsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}
