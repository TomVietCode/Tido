import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from '@/modules/categories/categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '@/modules/categories/categories.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RoleGuard } from '@/modules/auth/guards/role.guard';
import { Role } from '@/common/enums/index';
import { Roles } from '@/modules/auth/decorators/role.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BackendResponse, Category } from '@/common/interfaces';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create a new category' })
  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<BackendResponse<Category>> {
    const category = await this.categoriesService.create(createCategoryDto);
    return {
      statusCode: 200,
      message: 'Category created successfully',
      data: category as Category,
    }
  }

  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
