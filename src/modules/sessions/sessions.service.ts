import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class SessionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {
    }

    public async create(body: any) {
        const user = await this.prisma.user.findUnique({
            where: {login},
        });
        if (!user) throw new Error('User not found');
        const passwordMatched = await bcrypt.compare(password, user.password);
        if (!passwordMatched) throw new Error('Invalid password');

        await this.prisma.session.updateMany({
            where: {
                user: {
                    login,
                },
                active: true,
            },
            data: {
                active: false,
                updatedAt: new Date().toISOString(),
            },
        });

        const session = await this.prisma.session.create({
            data: {
                userId: user.id,
                ip,
                userAgent,
                createdAt: new Date().toISOString(),
            },
        });

        const payload: TokenPayload = {
            sessionId: session.id,
            userId: user.id,
        };

        return {token: this.jwtService.sign(payload)};
    }

    public async delete(token: TokenPayload) {
        return this.prisma.session.update({
            where: {
                id: token.session_id,
                user_id: token.user_id,
            },
            data: {
                updated_at: new Date().toISOString(),
                active: false,
            },
        });
    }
}