import {
  Controller,
  Get,
  Render,
  Body,
  Redirect,
  Query,
  Post,
} from '@nestjs/common';
import { syncBuiltinESMExports } from 'module';
import { AppService } from './app.service';
import { CatsDto } from './cats.dto';
import db from './db';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index() {
    const [rows] = await db.execute('SELECT * FROM macskak ORDER BY suly');

    return {
      cats: rows,
    };
  }

  @Get('search')
  @Render('index')
  async search(@Query('eyeColor') eyeColor) {
    const [rows] = await db.execute(
      'SELECT * FROM macskak WHERE szem_szin LIKE ? ORDER BY suly',
      ['%' + eyeColor + '%'],
    );

    return {
      cats: rows,
    };
  }

  @Get('cats/new')
  @Render('addCat')
  newCatFoprm() {
    return {};
  }

  @Post('cats/new')
  @Redirect()
  async newCat(@Body() cat: CatsDto) {
    const [result] = await db.execute(
      'INSERT INTO macskak (suly, szem_szin) VALUES (?, ?)',
      [cat.weight, cat.eyeColor],
    );

    return {
      url: '/',
    };
  }
}
