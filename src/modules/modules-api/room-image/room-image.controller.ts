import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { RoomImageService } from './room-image.service';
import { CreateRoomImageDto } from './dto/create-room-image.dto';
import { UpdateRoomImageDto } from './dto/update-room-image.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import type { Users } from 'generated/prisma';
import { ExcludeFields } from 'src/common/decorators/exclude-fields.decorator';
import { UploadSingleImageDto } from 'src/common/dtos/upload-single-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileValidationPipe } from 'src/modules/modules-system/file-validation/file-validation.service';
import { createMulterStorage } from 'src/common/helpers/utils';

const storage = createMulterStorage('public/roomImage');

@Controller('hinh-anh-phong-thue')
@ExcludeFields('deletedBy', 'isDeleted', 'deletedAt', 'updatedAt')
@ApiBearerAuth()
export class RoomImageController {
  constructor(private readonly roomImageService: RoomImageService) {}

  @Post('/upload-room-image/:roomId')
  @ApiOperation({ summary: 'Upload room image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Single file upload',
    type: UploadSingleImageDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
    }),
  )
  @MessageResponse('Upload a room image successfully!')
  create(
    @Param('roomId') roomId: string,
    @UploadedFile(ImageFileValidationPipe) file: Express.Multer.File,
    @CurrentUser() user: Users,
  ) {
    return this.roomImageService.create(+roomId, file, user);
  }

  @Get()
  @MessageResponse('Get all room images successfully!')
  findAll() {
    return this.roomImageService.findAll();
  }

  @Get('lay-hinh-anh-phong/:maPhong')
  @MessageResponse('Get all images of a room successfully!')
  findImageWithRoomId(@Param('maPhong') maPhong: string) {
    return this.roomImageService.findImageWithRoomId(+maPhong);
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

  // TODO add service for get room image with image id
}
