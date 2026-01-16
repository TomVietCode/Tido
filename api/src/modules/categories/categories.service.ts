import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@modules/categories/categories.dto'
import slugify from 'slugify'
import { PrismaService } from '@src/database/prisma/prisma.service'
import { Category } from '@src/common/interfaces'
import { CategoryStatus } from '@src/common/enums'
import { Prisma } from '@prisma/generated/prisma/client'

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    let slug = slugify(createCategoryDto.name, {
      lower: true,
      locale: 'vi',
      trim: true,
    })
    let existingCategory = await this.prisma.category.findUnique({
      where: { slug },
    })

    let count = 1
    while (existingCategory) {
      const newSlug = `${slug}-${count}`
      existingCategory = await this.prisma.category.findUnique({
        where: { slug: newSlug },
      })
      if (!existingCategory) {
        slug = newSlug
        break
      }
      count++
    }

    const category = await this.prisma.category.create({
      data: { ...createCategoryDto, slug },
    })
    return category
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      where: { status: CategoryStatus.ACTIVE },
    })
    return categories as Category[]
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } })
    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục')
    }
    return category as Category
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const updatedCategory = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      })

      return updatedCategory
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Tên danh mục đã tồn tại')
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('Không tìm thấy danh mục')
        }
      }
      throw error
    }
  }

  async remove(id: number) {
    try {
      const category = await this.prisma.category.delete({ where: { id } })
      return category as Category
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Không tìm thấy danh mục')
        }
      }
      throw error
    }
  }
}
