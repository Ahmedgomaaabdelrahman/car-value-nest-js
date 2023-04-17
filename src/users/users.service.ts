import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>){}

    create(email: string, password: string){
        const user = this.repo.create({email, password});
        return this.repo.save(user);
    }
    findOne(id : number) {
        if(!id) {
            return null;
        }
        const user = this.repo.find({where : {id}});
        if(!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    };
    // async find(email : string) {
    //     const allUsers = await this.repo.find({where : {email}});
    //     if(!allUsers.length) {
    //         throw new NotFoundException('There is no users with this email');
    //     }
    //     return allUsers;

    // };
    find(email: string) {
        return this.repo.find({where : {email}});
    }
    async update(id : number, attrs : Partial<User>) {
        const user = await this.findOne(id);
        if(!user){
            throw new Error('user not found');
        }
        return this.repo.save({id, ...attrs});

    };
    async remove(id: number) {
        const user = await this.findOne(id);
        if(!user){
            throw new Error("user not found")
        }
        return this.repo.remove(user);
    }
}
