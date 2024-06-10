import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  Put,
  Res,
  Req,
    Query,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './user.validation';
import { PaginationQueryParams } from '../utils/validation';
import { plainToClass } from 'class-transformer';
@Controller('users')
export class UsersController {
  private logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async register(@Body() data: CreateUserDto, @Res() res) {
    try {
      const user = await this.usersService.create(data);
      return res
        .status(201)
        .json({ message: 'User successfully registered: ', user: user });
    } catch (err) {
      this.logger.error(`Failed to register user:\n ${err}`);
      throw err;
    }
  }

  @Get()
  async findAll(@Query() params: any) {
    params = plainToClass(PaginationQueryParams, params);
    try {
      return this.usersService.findAll(params);
    } catch (err) {
      this.logger.error(`Failed to get users:\n ${err}`);
      throw err;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const user = await this.usersService.findOne(Number(id));
      if (user) return res.status(200).json(user);
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ message: 'User not found' });
    } catch (err) {
      this.logger.error(`Failed to get user:\n ${err}`);
      throw err;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
    @Res() res,
  ) {
    try {
      const user = await this.usersService.update(Number(id), data);
      return res
        .status(200)
        .json({ message: 'User successfully updated: ', user: user });
    } catch (err) {
      this.logger.error(`Failed to update user:\n ${err}`);
      throw err;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res, @Req() req) {
    try {
      await this.usersService.remove(Number(id), req.user);
      return res
        .status(200)
        .json({ message: `User with ID ${id} successfully deleted` });
    } catch (err) {
      this.logger.error(`Failed to delete user:\n ${err}`);
      throw err;
    }
  }
}