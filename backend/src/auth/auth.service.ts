import { Injectable } from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {SignupDto} from "./dto/signup.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}


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
