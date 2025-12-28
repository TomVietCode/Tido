import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from '@/modules/categories/categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '@/modules/categories/categories.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RoleGuard } from '@/modules/auth/guards/role.guard';
import { Role } from '@/common/enums/index';
import { Roles } from '@/modules/auth/decorators/role.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BackendResponse, Category } from '@/common/interfaces';
import { Public } from '@/modules/auth/decorators/public.decorator';

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
      message: 'Tạo danh mục mới thành công',
      data: category as Category,
    }
  }

  @ApiOperation({ summary: 'Get all categories' })
  @Public()
  @Get()
  async findAll(): Promise<BackendResponse<Category[]>> {
    try {
      const categories = await this.categoriesService.findAll();
      return {
        statusCode: 200,
        message: 'Lấy danh sách danh mục thành công',
        data: categories as Category[],
      }
    } catch (error) {
      return {
        statusCode: error.status,
        message: "Có lỗi xảy ra khi lấy danh sách danh mục",
      }
    }
  }
  
  @ApiOperation({ summary: 'Get a category by id' })
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BackendResponse<Category>> {
    try {
      const category = await this.categoriesService.findOne(+id);
      return {
        statusCode: 200,
        message: 'Lấy danh mục thành công',
        data: category as Category,
      }
    } catch (error) {
      return {
        statusCode: error.status,
        message: error.message,
      }
    }
  }

  @ApiOperation({ summary: 'Update a category by id' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoriesService.update(+id, updateCategoryDto);
      return {
        statusCode: 200,
        message: 'Cập nhật danh mục thành công',
        data: category,
      }
    } catch (error) {
      return {
        statusCode: error.status,
        message: error.message,
      }
    }
  }

  @ApiOperation({ summary: 'Delete a category by id' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string): Promise<BackendResponse<Category>> {
    try {
      const category = await this.categoriesService.remove(+id);
      return {
        statusCode: 200,
        message: 'Xóa danh mục thành công',
        data: category,
      }
    } catch (error) {
      return {
        statusCode: error.status,
        message: "Có lỗi xảy ra khi xóa danh mục",
      }
    }
  }
}
