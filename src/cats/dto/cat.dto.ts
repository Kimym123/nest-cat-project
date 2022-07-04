import {ApiProperty, PickType} from "@nestjs/swagger";
import {Cat} from "../cats.schema";

export class ReadonlyCatDto extends PickType(Cat,['email', 'name'] as const) {
    @ApiProperty({
        example: '12321',
        description: 'id',
    })
    id: string;
}