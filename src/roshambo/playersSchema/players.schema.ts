import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

enum moves{
   rock="RocK",
   paper="Paper",
   scissor="Scissor"
}

@Schema({timestamps:true})
export class Player{

    @Prop()
       id:string; 
    @Prop()
       move:moves[];
    @Prop()
       playingHistory:string[]        
}

export const PlayerSchema=SchemaFactory.createForClass(Player)