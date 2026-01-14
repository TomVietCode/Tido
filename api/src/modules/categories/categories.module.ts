import { Module } from '@nestjs/common'
import { CategoriesService } from '@modules/categories/categories.service'
import { CategoriesController } from '@modules/categories/categories.controller'

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
