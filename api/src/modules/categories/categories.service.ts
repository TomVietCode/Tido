import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '@/modules/categories/categories.dto';
import slugify from 'slugify';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    let slug = slugify(createCategoryDto.name, { lower: true, locale: "vi", trim: true })
    let existingCategory = await this.prisma.category.findUnique({ where: { slug } })
    
    let count = 1
    while (existingCategory) {
      const newSlug = `${slug}-${count}`
      existingCategory = await this.prisma.category.findUnique({ where: { slug: newSlug }})
      if (!existingCategory) {
        slug = newSlug
        break
      }
      count++
    }

    const category = await this.prisma.category.create({ data: { ...createCategoryDto, slug } })
    return category
  }

  async findAll() {
    return `This action returns all categories`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  async remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
