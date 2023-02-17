import { Module } from "@nestjs/common/";
import { RoshamboGateway } from "./game.gateway";


@Module({
providers:[RoshamboGateway]
})
export class EventsModule{}