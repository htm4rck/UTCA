import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateEjercicioDto {
  @IsString()
  @IsOptional()
  @MaxLength(150)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(8000)
  statement?: string;

  @IsString()
  @IsOptional()
  @MaxLength(8000)
  solution?: string;

  @IsString()
  @IsOptional()
  @IsIn(['easy', 'medium', 'hard'])
  difficulty?: 'easy' | 'medium' | 'hard';
}
