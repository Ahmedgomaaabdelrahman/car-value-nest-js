import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt} from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(private userService:UsersService){}

    async signIn(email: string , password: string){
        // get one user form the list of users
        const [user] = await this.userService.find(email);
        if(!user) {
            throw new NotFoundException("user not found");
        }

        // split the returned user password 
        const [salt, hash] = user.password.split('.');

        // hash the incoming password to compare
        // Hash the salt and the password together
        const incomingHash = (await scrypt(password, salt, 32)) as Buffer;

        if(hash !== incomingHash.toString('hex')){
            throw new BadRequestException('password is invaild')
        }
        
        return user


    }

    async signUp(email: string, password: string){
        // See if email in use
        const users = await this.userService.find(email);
        if(users.length) {
            throw new BadRequestException('email in use');
        }
        // Hash the user password
        // Generate a salt
        const salt = randomBytes(8).toString('hex');

        // Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');

        // Create a new user and save it
        const user = await this.userService.create(email, result);

        // return the user
        return user;
    }
}