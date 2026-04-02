import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrera, Ciclo, Curso, Semana, Evaluacion, Nota, Ejercicio } from './entities';
import { SeedModule } from './modules/seed/seed.module';
import { CarreraModule } from './modules/carrera/carrera.module';
import { CursoModule } from './modules/curso/curso.module';
import { SemanaModule } from './modules/semana/semana.module';
import { NotaModule } from './modules/nota/nota.module';
import { EjercicioModule } from './modules/ejercicio/ejercicio.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_NAME', 'economia_cuantitativa'),
        entities: [Carrera, Ciclo, Curso, Semana, Evaluacion, Nota, Ejercicio],
        synchronize: true,
      }),
    }),
    SeedModule,
    CarreraModule,
    CursoModule,
    SemanaModule,
    NotaModule,
    EjercicioModule,
    ReportModule,
  ],
})
export class AppModule {}
