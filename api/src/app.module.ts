import { Module } from '@nestjs/common'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '@/modules/auth/auth.module'
import { UsersModule } from '@/modules/users/users.module'
import { PrismaModule } from '@/prisma/prisma.module'
import config from '@/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import { PostsModule } from './modules/posts/posts.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { RoleGuard } from './modules/auth/guards/role.guard'

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}
