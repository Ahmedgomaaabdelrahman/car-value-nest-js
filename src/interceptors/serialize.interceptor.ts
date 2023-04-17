import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { UserDto } from "src/users/dtos/user.dto";

export function Serialize(dto :any) {
    return UseInterceptors(new SerializerInterceptor(dto))
}


export class SerializerInterceptor implements NestInterceptor{
    constructor(private dto: any){}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // to run something before the request
        // by the request handler
       
        return next.handle().pipe(
            map((data)=> {
                return plainToClass(this.dto, data, {excludeExtraneousValues: true})
            })
        )

    }
}