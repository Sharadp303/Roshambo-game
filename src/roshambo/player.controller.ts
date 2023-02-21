import { Controller, Get, Headers } from "@nestjs/common";
import { PlayerService } from "./player.service";

@Controller('game')
export class PlayerController{
constructor(private playerservice:PlayerService){}
   
@Get()
async playingHistory(@Headers('name') headers:string){

    return this.playerservice.playingHistory(headers)

}
    

}