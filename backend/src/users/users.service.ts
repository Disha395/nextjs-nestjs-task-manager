import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async findByEmail(email: string) {
        return this.prismaService.user.findUnique({
            where: {
                email,
            },
        });
    }

    async create(email: string, password: string) {
        return this.prismaService.user.create({
            data:{
                email,
                password,
            }
        });
    }


}
