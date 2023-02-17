import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { userSchema } from "./Schema/user.schema";

@Module({
    imports:[MongooseModule.forFeature([{name:'User',schema:userSchema}]),
             JwtModule.register({
                secret:"helloworld",
                signOptions:{expiresIn:'1d'}
                        })],
controllers:[AuthController],
providers:[AuthService]
})
export class AuthModule{}