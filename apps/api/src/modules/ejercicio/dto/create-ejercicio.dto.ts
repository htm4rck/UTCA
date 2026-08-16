import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEjercicioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(8000)
  statement: string;

  @IsString()
  @IsOptional()
  @MaxLength(8000)
  solution?: string;

  @IsString()
  @IsIn(['easy', 'medium', 'hard'])
  difficulty: 'easy' | 'medium' | 'hard';
}
