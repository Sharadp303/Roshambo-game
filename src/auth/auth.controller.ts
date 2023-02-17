import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { signInDto } from "./dto/signindto";
import { signUpDto } from "./dto/signupdto";

@Controller('auth')
export class AuthController{
          constructor(private readonly authservice:AuthService){}
    @Post('signup')
    signUp(@Body() signUpDto:signUpDto){
        return this.authservice.signUp(signUpDto);
    }

    @Post('signin')
    signin(@Body() signInDto:signInDto):any{
              return this.authservice.signIn(signInDto);
    }
}