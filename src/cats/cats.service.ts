import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CatRequestDto } from './dto/cats.request.dto';
import * as bcrypt from 'bcrypt';
import {CatsRepository} from "./cats.repository";
import {Cat} from "./cats.schema"; // 암호화 관련 패키지

@Injectable()
export class CatsService {
  constructor(private readonly catsRepository: CatsRepository) {}

  async getAllCat() {
    const allCat = await this. catsRepository.findAll();
    const readOnlyCats = allCat.map((data) => data.readOnlyData);
    return readOnlyCats;

  }

  async uploadImg(cat: Cat, files: Express.Multer.File[]) {
    const fileName = `cats/${files[0].filename}`;
    console.log(fileName);
    const newCat = await this.catsRepository.findByIdAndUpdateImg(
        cat.id,
        fileName,
    );
    console.log(newCat);
    return newCat;
  }

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
