import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { MessageBody, SubscribeMessage } from "@nestjs/websockets";
import { Model } from "mongoose";
import{Server,Socket} from 'socket.io'                                         
import { User } from "src/auth/Schema/user.schema";
import { Player } from "../playersSchema/players.schema";

enum moves{
    rock="RocK",
    paper="Paper",
    scissor="Scissor"
 }

 enum winStatus{
    win="Win",
    lose="Lose",
    tie="Tie"
 }

@Injectable()
@WebSocketGateway()
export class RoshamboGateway implements OnGatewayInit, OnGatewayConnection,OnGatewayDisconnect{
    constructor(@InjectModel(Player.name) private playerModel:Model<Player>,
               @InjectModel(User.name) private userModel:Model<User>){}

   



    @WebSocketServer()
    server:Server
    afterInit(server: any) {
        console.log('websocket initiated')
    }
    

    private roomName: string;


async  handleConnection(client: any) {
                    const headers = client.handshake.headers;
                        console.log(headers['name']);
                        let name=headers['name']
                        console.log('Client connected');   
                        
                        const user=await this.userModel.findOne({name:name})
                        console.log(user)
                        if(!user){
                            return `NOt a VAlid user`
                        }
                        
                        const player=await this.playerModel.create({id:client.id})
                        console.log(player._id)
                    
                        await user.history.push(player._id)
                        await user.save()


                    if (!this.roomName) {
                    // Generate random room name if no room exists
                    this.roomName = Math.random().toString(36).substring(7);
                    console.log(`Room name is ${this.roomName}`);
                    this.server.to(client.id).emit('message',`Waiting for 1 more player`)
                    }

                    // Join the room
                    client.join(this.roomName);

                    const room = this.server.sockets.adapter.rooms.get(this.roomName);
                    console.log(room)

                    if(room && room.size==2){
                   console.log('Real GAme |||||||||||||')

                   


                    }

                    if (room && room.size > 2) {
                    // If there are more than 2 clients in the room, generate a new room name and reset the room
                    this.roomName = Math.random().toString(36).substring(7);
                    console.log(`New room name is ${this.roomName}`);
                    client.join(this.roomName)
                    this.server.to(client.id).emit('message',`Waiting for 1 more player`)
                    this.server.to(this.roomName).emit('reset');
                    }



    }
  
   
    handleDisconnect(client: any) {
       console.log(`DisConnected User:${client.id}`)
    }

 private countmove=0;
    @SubscribeMessage('message')
    async letsplay(@ConnectedSocket() client:Socket ,@MessageBody() move:moves){
          console.log(client.id) 
          const player=await this.playerModel.findOne({id:client.id})
          //console.log(player)
          await  player.move.push(move)
          await player.save()
          
          const rooms = Array.from(client.rooms);
          console.log(rooms)
    
          this.server.emit('message',move)
          this.countmove++;
        //   const room = this.server.sockets.adapter.rooms.get(rooms[1]).size;
        //   console.log(room)
          
          
          if(this.countmove==2){
            console.log("chlo game khelte hai")
           const whoIsINRoom = this.server.sockets.adapter.rooms.get(rooms[1])
           const findUser =Array.from(whoIsINRoom)
           console.log(findUser)
           const player1=await this.playerModel.findOne({id:findUser[0]})
           console.log(player1)
           const player2= await this.playerModel.findOne({id:findUser[1]})
           console.log(player2)
                 
           if(player1.move[player1.move.length-1]==player2.move[player2.move.length-1]){
            this.server.emit('message',`Its a tie!!!!`)
            player1.playingHistory.push(winStatus.tie)
           await player1.save()
            player2.playingHistory.push(winStatus.tie)
           await player2.save()
           }

           else if( player1.move[player1.move.length-1]==moves.rock && player2.move[player2.move.length-1]==moves.paper){
            this.server.emit('message',`Winner is paper :${player2.id} `)
            player1.playingHistory.push(winStatus.lose)
           await player1.save()
            player2.playingHistory.push(winStatus.win)
           await player2.save()
           }

           else if( player1.move[player1.move.length-1]==moves.paper && player2.move[player2.move.length-1]==moves.rock){
            this.server.emit('message',`Winner is paper :${player1.id} `)
            player1.playingHistory.push(winStatus.win)
           await player1.save()
            player2.playingHistory.push(winStatus.lose)
           await player2.save()
           }

           else if( player1.move[player1.move.length-1]==moves.rock && player2.move[player2.move.length-1]==moves.scissor){
            this.server.emit('message',`Winner is Rock:${player1.id} `)
            player1.playingHistory.push(winStatus.win)
           await player1.save()
            player2.playingHistory.push(winStatus.lose)
           await player2.save()
           }

           else if( player1.move[player1.move.length-1]==moves.scissor && player2.move[player2.move.length-1]==moves.rock){
            this.server.emit('message',`Winner is Rock:${player2.id} `)
            player1.playingHistory.push(winStatus.lose)
            await player1.save()
            player2.playingHistory.push(winStatus.win)
            await player2.save()
           }

           else if( player1.move[player1.move.length-1]==moves.scissor && player2.move[player2.move.length-1]==moves.paper){
            this.server.emit('message',`Winner is Scissor:${player1.id} `)
            player1.playingHistory.push(winStatus.win)
            await player1.save()
            player2.playingHistory.push(winStatus.lose)
            await player2.save()
           }

           else if( player1.move[player1.move.length-1]==moves.paper && player2.move[player2.move.length-1]==moves.scissor){
            this.server.emit('message',`Winner is Scissor:${player2.id} `)
            player1.playingHistory.push(winStatus.lose)
           await  player1.save()
            player2.playingHistory.push(winStatus.win)
           await player2.save()
           }
           

           else{
            this.server.emit('message',`Enter the right Input`)
           }


           }

      
          }     

//         private findMaxRepeatedElement(arr):any{
//             let freq = {}; 
//             let maxFreq = 0; 
//             let ans="" 
        
//             for (let i = 0; i < arr.length; i++) {
//             let elem = arr[i];
//             if (freq[elem]) {
//                 freq[elem]++; 
//             } else {
//                 freq[elem] = 1; 
//             }
//             }
            
//             for(let value in freq){
//             if(freq[value]>maxFreq){
//                 maxFreq=freq[value]
//                 ans=value
//             }
//                 }
        
//             return ans; 
//         }
            
    }



