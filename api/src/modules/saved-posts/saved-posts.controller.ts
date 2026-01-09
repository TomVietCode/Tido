import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SavedPostsService } from './saved-posts.service';

@Controller('saved-posts')
export class SavedPostsController {
  constructor(private readonly savedPostsService: SavedPostsService) {}

  @Post()
  create(@Body() createSavedPostDto: any) {
    return this.savedPostsService.create(createSavedPostDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.savedPostsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSavedPostDto: any) {
    return this.savedPostsService.update(+id, updateSavedPostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.savedPostsService.remove(+id);
  }
}
