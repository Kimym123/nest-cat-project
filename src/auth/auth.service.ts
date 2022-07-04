import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CatsRepository } from '../cats/cats.repository';
import { LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly catsRepository: CatsRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogin(data: LoginRequestDto) {
    const { email, password } = data;

    // * 해당하는 email 이 있는지 없는지 체크
    const cat = await this.catsRepository.findCatByEmail(email);

    if (!cat) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    // * 패스워드가 일치하는지 여부
    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      cat.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    // * jwt 를 프론트엔드에게 반환해야한다. -> 프론트엔드는 jwt 를 받아서 안전한 곳에 저장한다.
    const payload = { email: email, sub: cat.id }; // sub 는 토큰제목이다. -> cat 의 고유 식별자를 넣는다.

    return {
      token: this.jwtService.sign(payload), // jwt 메서드 중 sign 이라는 것을 통해 payload 를 넣어 토큰을 만든다. -> 토큰이 곧 jwt
    };
  }
}
