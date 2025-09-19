import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { QueryRoomDto } from './dto/query-room.dto';

@Controller('phong-thue')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @MessageResponse('Create one room successfully!')
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  @MessageResponse('Get all rooms successfully!')
  findAll() {
    return this.roomService.findAll();
  }

  @Get('/phan-trang-tim-kiem')
  @MessageResponse('Get all rooms with pagination successfully!')
  findAllPagination(@Query() query: QueryRoomDto) {
    return this.roomService.findAllPagination(query);
  }

  @Get(':id')
  @MessageResponse('Get one room successfully!')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(+id);
  }

  @Patch(':id')
  @MessageResponse('Edit one room successfully!')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  @MessageResponse('Delete one room successfully!')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }
}
