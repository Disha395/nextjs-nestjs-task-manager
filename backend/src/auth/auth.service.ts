import { Injectable } from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {SignupDto} from "./dto/signup.dto";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {LoginDto} from "./dto/login.dto";
import { UnauthorizedException } from '@nestjs/common';


@Injectable()
export class AuthService {
    constructor(private userService: UsersService,
    private jwtService: JwtService
) {}


async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
        throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
        dto.password,
        user.password,
    );

    if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user.id });

    return {
        access_token: token,
    };
}


    async signup(dto : SignupDto){
        const existingUser = await this.userService.findByEmail(dto.email);

        if(existingUser){
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.userService.create(dto.email, hashedPassword);

        return {
            message: "User created successfully",
            user: {
                id : user.id,
                email : user.email,
            }
        }
    }
}
