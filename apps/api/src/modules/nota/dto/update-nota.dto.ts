import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateNotaDto {
  @IsString()
  @IsOptional()
  @MaxLength(150)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(8000)
  content?: string;
}
