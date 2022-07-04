import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CatRequestDto } from './dto/cats.request.dto';
import * as bcrypt from 'bcrypt';
import {CatsRepository} from "./cats.repository"; // 암호화 관련 패키지

@Injectable()
export class CatsService {
  constructor(private readonly catsRepository: CatsRepository) {}

  async signUp(body: CatRequestDto) {
    const { email, name, password } = body;
    const isCatExist = await this.catsRepository.existsByEmail(email);

    if (isCatExist) {
      // throw new HttpException('해당하는 고양이는 이미 존재합니다.', 403); 이거보단 밑에 코드가 세련됨
      throw new UnauthorizedException('해당하는 고양이는 이미 존재합니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // db에 저장
    const cat = await this.catsRepository.create({
      email,
      name,
      password: hashedPassword, // 암호화된 패스워드를 저장.
    });

    return cat.readOnlyData;
  }
}
