import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import {LoginDto} from './dto/login.dto'
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private prisma : PrismaService,
        private jwtService : JwtService,
    ){}

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
    
    async login(dto:LoginDto){
        const user = await this.prisma.user.findUnique({
            where : {email :dto.email}
        });

        if(!user){
            throw new UnauthorizedException('Invalid Credentials');
        }

        const passwordMatch = await bcrypt.compare(dto.password ,user.password);

        if(!passwordMatch){
            throw new UnauthorizedException('Invalid Credentials');
        }

        const payload = {sub : user.id , email:user.email};
        const token =  await this.jwtService.signAsync(payload); 

        return {
            access_token :token,
            user:{
                id :user.id,
                email :user.email,
            }
        };
    }
}
