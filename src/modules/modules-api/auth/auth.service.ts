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

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(loginDto: LoginDto) {
    const { email, password, token } = loginDto;

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

    // neu tai khoan nguoi dung co bat 2FA thi moi xu ly
    if (userExist.totpSecret) {
      if (!token) {
        // buoc 1: khong gui token

        //Tra ve isToken la true de cho FE chuyen sang giao dien nhap token
        return { isTotp: true };
      } else {
        // buoc 2: phari gui token
        // co token roi thi se kiem tra xem token co hop le khong
        this.totpService.verify({ token: token }, userExist);
      }
    }

    // Nếu code chạy được tới đây => đảm bảo có userExits

    // do tài khoản đăng nhập bằng gmail hoặc facebook
    // lúc này tài khoản sẽ không có mật khẩu
    // nên nếu người dùng cố tình đăng nhập bằng email thì sẽ không có mật khẩu để kiểm tra
    // nên phải bắt người dùng đăng nhập bằng email vào setting để cập nhật lại mật khẩu mới
    const isPasswordValid = bcrypt.compareSync(password, userExist.password);
    if (!isPasswordValid) throw new BadRequestException(`Invalid password`);
    // if (!isPasswordValid) throw new BadRequestException(`Invalid user!!!`);// for security reason

    // return tokens
    const tokens = this.tokenService.createTokens(userExist.id);

    // sendMail(email);

    console.log(tokens);
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
