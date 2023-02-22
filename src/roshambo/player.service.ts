import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";
import { User } from "src/auth/Schema/user.schema";
import { Player } from "./playersSchema/players.schema";

@Injectable()
export class PlayerService{
    constructor(@InjectModel(User.name) private userModel:Model<User>,
                @InjectModel(Player.name) private playerModel:Model<Player>){}

async playingHistory(name:string){
    const user=await this.userModel.findOne({name:name})
    const alldata=user.history;
    const ans= await this.playerModel.find({_id:alldata})
   // console.log(ans)

    const obj={}
    ans.forEach(ele=>{
        obj['id']=ele.id;
        obj['move']=ele.move;
        obj['playinghistory']=ele.playingHistory
    })

    return obj;
}

}