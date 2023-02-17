import { Schema,Prop,SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps:true})

export class User{

    @Prop()
    name:string;

    @Prop()
    email:string;

    @Prop()
    password:string;

}

export const userSchema=SchemaFactory.createForClass(User)