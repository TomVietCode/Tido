import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { CategoriesService } from '@modules/categories/categories.service'
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@modules/categories/categories.dto'
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard'
import { RoleGuard } from '@modules/auth/guards/role.guard'
import { Role } from '@common/enums'
import { Roles } from '@modules/auth/decorators/role.decorator'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Category } from '@common/interfaces'
import { Public } from '@modules/auth/decorators/public.decorator'

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create a new category' })
  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoriesService.create(createCategoryDto)
    return category as Category
  }

  @ApiOperation({ summary: 'Get all categories' })
  @Public()
  @Get()
  async findAll(): Promise<Category[]> {
    const categories = await this.categoriesService.findAll()
    return categories
  }

  @ApiOperation({ summary: 'Get a category by id' })
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    const category = await this.categoriesService.findOne(+id)
    return category as Category
  }

  @ApiOperation({ summary: 'Update a category by id' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.update(+id, updateCategoryDto)
    return category as Category
  }

  @ApiOperation({ summary: 'Delete a category by id' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string): Promise<Category> {
    const category = await this.categoriesService.remove(+id)
    return category as Category
  }
}
