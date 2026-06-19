import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(private prisma : PrismaService){}

    async register (dto: RegisterDto){
        const existing  = await this.prisma.user.findUnique({
            where : {email : dto.email}
        });

        if(existing){
            throw new ConflictException("Email already Reistered");
        }

        const hashedPassword = await bcrypt.hash(dto.password , 10);


        const user = await this.prisma.user.create({
            data : {
                email : dto.email,
                password : hashedPassword,
                createdAt: new Date(),
            }
        });
        return {
            id : user.id,
            email :user.email,
            createdAt : user.createdAt,
        };
    }
}
