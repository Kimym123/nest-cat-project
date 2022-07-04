import { Cat } from '../cats.schema';
import {PickType} from "@nestjs/swagger";

export class CatRequestDto extends PickType(Cat, [
    'email',
    'name',
    'password',
] as const) {}
