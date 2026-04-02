import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateNotaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(8000)
  content: string;
}
