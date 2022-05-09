import {Body, Controller, Post, UnauthorizedException} from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from 'src/user/schema/user.schema';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/auth.dt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService ) {}
  
  @Post('register')

  async registerUser(@Body() createUserDto:CreateUserDto):Promise<User | Object> { //CreateUser or Register
    const user = this.authService.createUser(createUserDto.name, createUserDto.password, createUserDto.email, createUserDto.role)
    return user
  }

  @Post('login')
  async loginUser(@Body() loginUserDto:LoginUserDto): Promise<User | Object> {
    const user = await  this.authService.login(loginUserDto.email)
    if(!user) throw new UnauthorizedException('User does not exist')
    const match = await bcrypt.compare(loginUserDto.password,user.password)
    if(!match) throw new UnauthorizedException('Password not match')
    return user;
  }
 
}