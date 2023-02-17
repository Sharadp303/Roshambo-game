import {  Injectable,UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { signInDto } from "./dto/signindto";
import { signUpDto } from "./dto/signupdto";
import { User } from "./Schema/user.schema";
import * as bcrypt  from 'bcrypt';
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService{
constructor(@InjectModel(User.name) private userModel:Model<User>,
                                    private jwtservice:JwtService){}

  async signUp(signUpDto:signUpDto){
    const{name,email,password}=signUpDto
    const hashPass=await bcrypt.hash(password,10)

      const res=await this.userModel.create({name,
                                            email,
                                            password:hashPass})
      
                                     
  return `Signed up successFully`; 
}

async signIn(signInDto:signInDto){
   let {email,password}=signInDto;

      const res= await this.userModel.findOne({email})
      if(!res){
        throw new UnauthorizedException("Invalid email or password")
      }

    
      const validUser= await bcrypt.compare(password,res.password)
      if(!validUser){
        throw new UnauthorizedException("Invalid email or password")
      }

      const token=this.jwtservice.sign({id:res._id})
      return {Status:'Signed In',
              token:token}
      }

}