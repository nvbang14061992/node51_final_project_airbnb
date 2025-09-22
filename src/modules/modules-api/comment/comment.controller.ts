import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ExcludeFields } from 'src/common/decorators/exclude-fields.decorator';

@Controller('binh-luan')
@ApiBearerAuth()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @MessageResponse('Create a comment successfully')
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  @MessageResponse('Get all comments successfully')
  @ExcludeFields('deletedBy', 'isDeleted', 'deletedAt')
  findAll() {
    return this.commentService.findAll();
  }

  @Patch(':id')
  @MessageResponse('Edit a comment successfully')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  @MessageResponse('Delete a comment successfully')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
