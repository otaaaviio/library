import {Controller, Get, Post, Body, Patch, Param, Delete, Logger, HttpException, Put} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto, UpdateUserDto} from "./user.validation";

@Controller('users')
export class UsersController {
    private logger = new Logger(UsersController.name);

    constructor(private readonly usersService: UsersService) {
    }

    @Post('/register')
    register(@Body() data: CreateUserDto) {
        try {
            return this.usersService.create(data);
        } catch (err) {
            this.logger.error(`Failed to login: ${err}`);
            throw new HttpException(err?.message || 'An error occurred', 400);
        }
    }

    @Get()
    findAll() {
        try {
            return this.usersService.findAll();
        } catch (err) {
            this.logger.error(`Failed to get users: ${err}`);
            throw new HttpException(err?.message || 'An error occurred', 400);
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        try {
            return this.usersService.findOne(Number(id));
        } catch (err) {
            this.logger.error(`Failed to get user: ${err}`);
            throw new HttpException(err?.message || 'An error occurred', 400);
        }
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: UpdateUserDto) {
        try {
            return this.usersService.update(Number(id), data);
        } catch (err) {
            this.logger.error(`Failed to update user: ${err}`);
            throw new HttpException(err?.message || 'An error occurred', 400);
        }
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        try {
            return this.usersService.remove(Number(id));
        } catch (err) {
            this.logger.error(`Failed to delete user: ${err}`);
            throw new HttpException(err?.message || 'An error occurred', 400);
        }
    }
}
