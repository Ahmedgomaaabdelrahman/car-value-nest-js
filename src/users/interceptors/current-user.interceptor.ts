import { NestInterceptor, ExecutionContext, Injectable, CallHandler } from "@nestjs/common";
import { UsersService } from "../users.service";
import { Observable } from "rxjs";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor{
    constructor(private userService: UsersService){}

    async intercept(context: ExecutionContext, next: CallHandler<any>){
        const request = context.switchToHttp().getRequest();

        // desctruction the session object 
        const {userId} = request.session || {};

        // if there is a userID means the user is logged in
        if(userId) {
            const user = await this.userService.findOne(userId);
            // assign it to the current request 
            request.currentUser = user;
        }
       

        return next.handle()
    }
}