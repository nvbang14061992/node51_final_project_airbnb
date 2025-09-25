import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ExcludeFields } from 'src/common/decorators/exclude-fields.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { QueryLocationDto } from './dto/query-location.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterStorage } from 'src/common/helpers/utils';
import { ImageFileValidationPipe } from 'src/modules/modules-system/file-validation/file-validation.service';
import { UploadSingleImageDto } from 'src/common/dtos/upload-single-image.dto';
import { QueryIdDto } from 'src/common/dtos/query-id.dto';

const storage = createMulterStorage('public/locationImage');

@Controller('vi-tri')
@ExcludeFields('deletedBy', 'isDeleted', 'deletedAt', 'createdAt', 'updatedAt')
@ApiBearerAuth()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @MessageResponse('Create one location successfully!')
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Get()
  @MessageResponse('Get all locations successfully!')
  findAll() {
    return this.locationService.findAll();
  }

  @Get('phan-trang-tim-kiem')
  @MessageResponse('Get all locations with pagination successfully!')
  findAllWithPagination(@Query() query: QueryLocationDto) {
    return this.locationService.findAllWithPagination(query);
  }

  @Get(':id')
  @MessageResponse('Get one location successfully!')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(+id);
  }

  @Patch(':id')
  @MessageResponse('Edit one location successfully!')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationService.update(+id, updateLocationDto);
  }

  @Delete(':id')
  @MessageResponse('Delete one location successfully!')
  remove(@Param('id') id: string) {
    return this.locationService.remove(+id);
  }

  @Post('upload-hinh-vitri')
  @ApiOperation({ summary: 'Upload a single file' })
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
  @MessageResponse('Upload room images successfully!')
  uploadImageLocation(
    @Query() query: QueryIdDto,
    @UploadedFile(ImageFileValidationPipe) file: Express.Multer.File,
  ) {
    return this.locationService.uploadImageLocal(query, file);
  }
}
