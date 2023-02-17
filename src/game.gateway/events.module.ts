import { Module } from "@nestjs/common/";
import { RoshamboGateway } from "./game.gateway";
import { ChatGateway } from "./room.gateway";

@Module({
providers:[RoshamboGateway,ChatGateway]
})
export class EventsModule{}