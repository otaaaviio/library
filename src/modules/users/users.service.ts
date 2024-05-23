import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.validation';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const hashed_pass = bcrypt.hashSync(data.password, 10);
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashed_pass,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id: id,
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        CreatedAuthors: {
          select: {
            id: true,
            name: true,
          },
        },
        CreatedBooks: {
          select: {
            id: true,
            title: true,
          },
        },
        CreatedReviews: {
          select: {
            id: true,
            comment: true,
          },
        },
        CreatedPublishers: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdateUserDto) {
    if (data.password) data.password = bcrypt.hashSync(data.password, 10);

    return this.prisma.user.update({
      where: {
        id: id,
        deleted_at: null,
      },
      data: data,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.user.update({
      where: {
        id: id,
        deleted_at: null,
      },
      data: {
        deleted_at: new Date(),
      },
      select: {
        id: true,
      },
    });
  }
}
