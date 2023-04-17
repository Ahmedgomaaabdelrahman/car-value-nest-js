import { Controller, Post, Get, Body, Param, Query, Delete, Patch, UseInterceptors, ClassSerializerInterceptor, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { currentUser } from './decorator/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from './gaurds/auth.guard';


@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private userService:UsersService, private authService:AuthService){}
    @Post('/signup')
    async createUser(@Body() userData:CreateUserDto, @Session() session:any ){
      const user = await this.authService.signUp(userData.email, userData.password);
      // set user id in session from returned user id 
      session.userId = user.id;
      return user;
    }

    @Post('/signin')
    async signin(@Body() userData: CreateUserDto, @Session() session:any ){
      const user = await this.authService.signIn(userData.email, userData.password);
      session.userId = user.id;
      return user;
    }

    // @Get('/whoAmI') 
    // whoAmI(@Session() session: any){
    //   return this.userService.findOne(session.userId);
    // }

    @Get('/whoAmI')
    @UseGuards(AuthGuard)
    whoAmI(@currentUser() user: User){
      return user;
    }


    @Post('/signout')
    signout(@Session() session: any){
      session.userId = null;
    }
    // quick ex about the session
    // @Get('/colors/:color')
    // setColor(@Param('color') color: string, @Session() session: any){
    //   session.color = color
    // }

    // @Get('/colors')
    // getColor(@Session() session: any){
    //   return session.color
    // }
 
    @Get('/:id')
    findUser(@Param('id') id:string){
      return this.userService.findOne(parseInt(id))
    }

    @Get()
    findAllUsers(@Query('email') email:string ) {
      return this.userService.find(email)
    }

    @Delete('/:id')
    removeUser(@Param('id') id:string){
      return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id:string, @Body() body: UpdateUserDto){
      return this.userService.update(parseInt(id), body)
    }
}
