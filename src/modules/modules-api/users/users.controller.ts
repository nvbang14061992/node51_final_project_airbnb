import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { ExcludeFields } from 'src/common/decorators/exclude-fields.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SignupDto } from '../auth/dto/signup.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import type { Users } from 'generated/prisma';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

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
}
