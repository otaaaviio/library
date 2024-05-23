import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Logger,
    Put, Res
} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto, UpdateUserDto} from './user.validation';
import {PaginationQueryParams} from '../utils/validation';

@Controller('users')
export class UsersController {
    private logger = new Logger(UsersController.name);

    constructor(private readonly usersService: UsersService) {
    }

    @Post('/register')
    async register(@Body() data: CreateUserDto, @Res() res) {
        try {
            const user = await this.usersService.create(data);
            return res.status(201).json({message: 'User successfully registered: ', user: user});
        } catch (err) {
            this.logger.error(`Failed to register user:\n ${err}`);
            throw err;
        }
    }

    @Get()
    async findAll(@Body() params: PaginationQueryParams) {
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
            return user ?? res.status(404).send({message: 'User not found'});
        } catch (err) {
            this.logger.error(`Failed to get user:\n ${err}`);
            throw err;
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: UpdateUserDto, @Res() res) {
        try {
            const user = await this.usersService.update(Number(id), data);
            return res.status(200).json({message: 'User successfully updated: ', user: user});
        } catch (err) {
            this.logger.error(`Failed to update user:\n ${err}`);
            throw err;
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Res() res) {
        try {
            await this.usersService.remove(Number(id));
            return res.status(200).json({message: `User with ID ${id} successfully deleted`});
        } catch (err) {
            this.logger.error(`Failed to delete user:\n ${err}`);
            throw err;
        }
    }
}
