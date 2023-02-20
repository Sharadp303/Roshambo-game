import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { userSchema } from "src/auth/Schema/user.schema";
import { RoshamboGateway } from "./gateway/game.gateway";
import { PlayerSchema } from "./playersSchema/players.schema";

@Module({
      imports:[MongooseModule.forFeature([{name:'Player',schema:PlayerSchema}]),
      MongooseModule.forFeature([{name:'User',schema:userSchema}])
    ],
      providers:[RoshamboGateway]
})
export class PlayerModule{}