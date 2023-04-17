import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const currentUser = createParamDecorator((data, context: ExecutionContext) => {
    // we can get the session from the incoming request 
    const req = context.switchToHttp().getRequest()
    const currentUser = req.currentUser;
    
    return currentUser
});