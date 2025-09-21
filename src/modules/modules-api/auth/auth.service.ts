import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'src/modules/modules-system/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const userExist = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!userExist)
      throw new BadRequestException(
        `Email ${email} not found, please register first`,
      );

    if (!userExist.password) {
      throw new BadRequestException(
        'Vui long dang nhap bang mang xa hoi (gmail, facebook',
      );
    }

    // const isPasswordValid = bcrypt.compareSync(password, userExist.password);
    // if (!isPasswordValid) throw new BadRequestException(`Invalid password`);

    // return tokens
    const tokens = this.tokenService.createTokens(userExist.id);

    return tokens;
  }

  create(createAuthDto: CreateAuthDto) {
    throw new NotImplementedException();
  }

  findAll() {
    throw new NotImplementedException();
  }

  findOne(id: number) {
    throw new NotImplementedException();
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    throw new NotImplementedException();
  }

  remove(id: number) {
    throw new NotImplementedException();
  }
}
