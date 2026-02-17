import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { GuestbookService } from './guestbook.service';

@Controller('api/guestbook')
export class GuestbookController {
  constructor(private readonly service: GuestbookService) {}

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: { name: string; message: string }) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: { name: string; message: string }) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}