import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomImageService } from './room-image.service';
import { CreateRoomImageDto } from './dto/create-room-image.dto';
import { UpdateRoomImageDto } from './dto/update-room-image.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import type { Users } from 'generated/prisma';

@Controller('hinh-anh-phong-thue')
@ApiBearerAuth()
export class RoomImageController {
  constructor(private readonly roomImageService: RoomImageService) {}

  @Post()
  @MessageResponse('Upload a room image successfully!')
  create(@Body() createRoomImageDto: CreateRoomImageDto) {
    return this.roomImageService.create(createRoomImageDto);
  }

  @Get()
  @MessageResponse('Get all room images successfully!')
  findAll() {
    return this.roomImageService.findAll();
  }

  @Get(':id')
  @MessageResponse('Get a room image successfully!')
  findOne(@Param('id') id: string) {
    return this.roomImageService.findOne(+id);
  }

  @Delete(':id')
  @MessageResponse('Delete a room image successfully!')
  remove(@Param('id') id: string, @CurrentUser() user: Users) {
    return this.roomImageService.remove(+id, user);
  }
}
