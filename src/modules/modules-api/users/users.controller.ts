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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { ExcludeFields } from 'src/common/decorators/exclude-fields.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { SignupDto } from '../auth/dto/signup.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import type { Users } from 'generated/prisma';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterStorage } from 'src/common/helpers/utils';
import { ImageFileValidationPipe } from 'src/modules/modules-system/file-validation/file-validation.service';
import { UploadSingleDto } from './dto/uploadUserImage.dto';

const storage = createMulterStorage('public/userAvatar');

@Controller('nguoi-dung')
@ExcludeFields(
  'deletedBy',
  'isDeleted',
  'deletedAt',
  'createdAt',
  'updatedAt',
  'password',
)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @MessageResponse('Create new user successfully')
  create(@Body() createUserDto: SignupDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @MessageResponse('Get all users successfully')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('phan-trang-tim-kiem')
  @MessageResponse('Get all users successfully')
  findAllUserPagination(@Query() query: QueryUserDto) {
    return this.usersService.findAllUserPagination(query);
  }

  @Get('search/:TenNguoiDung')
  @MessageResponse('Get all users successfully')
  findAllUserByName(@Param('TenNguoiDung') teNguoiDung: string) {
    return this.usersService.findAllUserByName(teNguoiDung);
  }

  @Patch('update-profile')
  @MessageResponse("Edit user's information successfully")
  updateProfile(
    @Body() updateUserDto: UpdateUserProfileDto,
    @CurrentUser() user: Users,
  ) {
    return this.usersService.updateProfile(updateUserDto, user);
  }

  @Get(':id')
  @MessageResponse('Get user successfully')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @MessageResponse("Edit user's information successfully")
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @MessageResponse('Delete a user successfully')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('upload-avatar')
  @ApiOperation({ summary: 'Upload user avatar' })
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
  upLoadAvatar(
    @UploadedFile(ImageFileValidationPipe) file: Express.Multer.File,
    @CurrentUser() user: Users,
  ) {
    return this.usersService.upLoadAvatar(file, user);
  }

  @Post('register-host/')
  @MessageResponse(
    'Register to be host successfully.\nYou now can create new location and host rooms from locations, but can not comment on any post!',
  )
  registerHost(@CurrentUser() user: Users) {
    return this.usersService.registerHost(user);
  }
}
