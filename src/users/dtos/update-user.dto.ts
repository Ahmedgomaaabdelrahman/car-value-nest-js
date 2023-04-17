import { IsEmail, IsOptional, IsString } from "class-validator";
import { BeforeUpdate } from "typeorm";

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email :string;

    @IsString()
    @IsOptional()
    password: string;

}