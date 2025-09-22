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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { QueryRoomDto } from './dto/query-room.dto';
import { QueryRoomLocationDto } from './dto/query-location.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import type { Users } from 'generated/prisma';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { ExcludeFields } from 'src/common/decorators/exclude-fields.decorator';
import { QueryRoomIdDto } from './dto/query-maphong.dto';
import { UploadSingleDto } from './dto/uploadRoomImage.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { createMulterStorage } from 'src/common/helpers/utils';
import { ImageFileValidationPipe } from 'src/modules/modules-system/file-validation/file-validation.service';

const storage = createMulterStorage('public/roomImage');

@Controller('phong-thue')
@ExcludeFields('deletedBy', 'isDeleted', 'deletedAt', 'createdAt', 'updatedAt')
@ApiBearerAuth()
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('/lay-phong-theo-vi-tri')
  @MessageResponse('Get all rooms with specified location successfully!')
  findAllLocation(@Query() query: QueryRoomLocationDto) {
    return this.roomService.findAllLocation(query);
  }

  @Post()
  @MessageResponse('Create one room successfully!')
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  @MessageResponse('Get all rooms successfully!')
  findAll(@CurrentUser() user: Users) {
    console.log(user);
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

  @Post('upload-hinh-phong')
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Single file upload',
    type: UploadSingleDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
    }),
  )
  @MessageResponse('Upload room images successfully!')
  uploadImageLocal(
    @Query() query: QueryRoomIdDto,
    @UploadedFile(ImageFileValidationPipe) file: Express.Multer.File,
  ) {
    return this.roomService.uploadImageLocal(query, file);
  }
}
