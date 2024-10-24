import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(300)
    image: string

    @IsNumber()
    @IsNotEmpty()
    price: number

    @IsNumber()
    @IsNotEmpty()
    miqdor: number
}
