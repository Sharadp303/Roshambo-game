import { Schema,Prop,SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Player } from "src/roshambo/playersSchema/players.schema";

@Schema({timestamps:true})

export class User{

    @Prop()
    name:string;

    @Prop()
    email:string;

    @Prop()
    password:string;

    @Prop({type:[{type:mongoose.Schema.Types.ObjectId,ref:'Player'}]})
    history:any[];

}

export const userSchema=SchemaFactory.createForClass(User)