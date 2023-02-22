import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { MessageBody, SubscribeMessage } from "@nestjs/websockets";
import { Model } from "mongoose";
import{Server,Socket} from 'socket.io'                                         
import { User } from "src/auth/Schema/user.schema";
import { Player } from "../playersSchema/players.schema";

enum moves{
    rock="rock",
    paper="paper",
    scissor="scissor",
    late="late"
 }

 enum winStatus{
    win="win",
    lose="lose",
    tie="tie"
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
                        this.server.to(this.roomName).emit('message',`Lets start the Game`)
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
         
          
         
           let currentTimeAndDate=Date.now()
           let curr:any=new Date(currentTimeAndDate)
          
           let min=curr.getMinutes()-player.updatedAt.getMinutes();

             let sec;
                        if(curr.getSeconds()<player.updatedAt.getSeconds()){
                            let a=Number(curr.getSeconds()+60)
                            let b=Number(player.updatedAt.getSeconds())
                            sec=a-b 
                            console.log(sec) 
                        }
                        else{
                            console.log(curr.getSeconds())
                            console.log(player.updatedAt.getSeconds())
                            sec=curr.getSeconds()-player.updatedAt.getSeconds() 
                            console.log(sec)
                        }
       

          if(sec>30 || min>1){
            await player.move.push(moves.late)
            await player.save()
            this.server.to(client.id).emit('message',`You have taken more than 30 seconds`)

          }else{
            await player.move.push(move)
          await player.save()
          this.server.emit('message',move)
          }

          const rooms = Array.from(client.rooms);
          console.log(rooms)
    
          this.countmove++;
        //   const room = this.server.sockets.adapter.rooms.get(rooms[1]).size;
        //   console.log(room)

        /// Stoppong Condition
            
          if((this.countmove%2)==0){
            
            console.log("chlo game khelte hai")
            
           const whoIsINRoom = this.server.sockets.adapter.rooms.get(rooms[1])
           const findUser =Array.from(whoIsINRoom)
           console.log(findUser)
           const player1=await this.playerModel.findOne({id:findUser[0]})
           //console.log(player1)
           const player2= await this.playerModel.findOne({id:findUser[1]})
           //console.log(player2)
           
           
           if(player1.move[player1.move.length-1]==player2.move[player2.move.length-1]){
            player1.playingHistory.push(winStatus.tie)
           await player1.save()
            player2.playingHistory.push(winStatus.tie)
           await player2.save()
           this.server.emit('message',`Its a tie!!!!`)

           }

           else if( (player1.move[player1.move.length-1] as moves)==moves.rock && (player2.move[player2.move.length-1] as moves)==moves.paper){
            player1.playingHistory.push(winStatus.lose)
           await player1.save()
            player2.playingHistory.push(winStatus.win)
           await player2.save()
           this.server.emit('message',`Winner is paper :${player2.id} `)

           }

           else if( (player1.move[player1.move.length-1] as moves)==moves.paper && (player2.move[player2.move.length-1] as moves)==moves.rock){
            player1.playingHistory.push(winStatus.win)
           await player1.save()
            player2.playingHistory.push(winStatus.lose)
           await player2.save()
           this.server.emit('message',`Winner is paper :${player1.id} `)

           }

           else if( (player1.move[player1.move.length-1] as moves)==moves.rock && (player2.move[player2.move.length-1] as moves)==moves.scissor){
            player1.playingHistory.push(winStatus.win)
           await player1.save()
            player2.playingHistory.push(winStatus.lose)
           await player2.save()
           this.server.emit('message',`Winner is Rock:${player1.id} `)

           }

           else if( (player1.move[player1.move.length-1] as moves)==moves.scissor && (player2.move[player2.move.length-1] as moves)==moves.rock){
            player1.playingHistory.push(winStatus.lose)
            await player1.save()
            player2.playingHistory.push(winStatus.win)
            await player2.save()
            this.server.emit('message',`Winner is Rock:${player2.id} `)

           }

           else if( (player1.move[player1.move.length-1] as moves)==moves.scissor && (player2.move[player2.move.length-1] as moves)==moves.paper){
            player1.playingHistory.push(winStatus.win)
            await player1.save()
            player2.playingHistory.push(winStatus.lose)
            await player2.save()
            this.server.emit('message',`Winner is Scissor:${player1.id} `)

           }

           else if( (player1.move[player1.move.length-1] as moves)==moves.paper && (player2.move[player2.move.length-1] as moves)==moves.scissor){
            player1.playingHistory.push(winStatus.lose)
           await  player1.save()
            player2.playingHistory.push(winStatus.win)
           await player2.save()
           this.server.emit('message',`Winner is Scissor:${player2.id} `)

           }
           else if( (player1.move[player1.move.length-1] as moves)==moves.late &&
                        ( ((player2.move[player2.move.length-1] as moves)==moves.scissor) || 
                           ((player2.move[player2.move.length-1] as moves)==moves.rock) || 
                           ((player2.move[player2.move.length-1] as moves)==moves.paper) 
                           ) ){
                                player1.playingHistory.push(winStatus.lose)
                            await  player1.save()
                                player2.playingHistory.push(winStatus.win)
                            await player2.save()
                            this.server.emit('message',`Winner is :${player2.id} `)

                            }

           else if( (player2.move[player1.move.length-1] as moves)==moves.late &&
           ( ((player1.move[player2.move.length-1] as moves)==moves.scissor) || 
              ((player1.move[player2.move.length-1] as moves)==moves.rock) || 
              ((player1.move[player2.move.length-1] as moves)==moves.paper) 
              ) ){
                    player1.playingHistory.push(winStatus.win)
                    await  player1.save()
                    player2.playingHistory.push(winStatus.lose)
                    await player2.save()
                    this.server.emit('message',`Winner is :${player1.id} `)

                    }
                            

           else{
            this.server.emit('message',`Enter the right Input or you should wait for another player`)
           }


                            if(player1.playingHistory.length==3){
                                let winningCount1=0;
                                let winningCount2=0;
                                console.log(player1.playingHistory)
                                console.log(player2.playingHistory)

                                player1.playingHistory.forEach((ele)=>{
                                    if(ele==winStatus.win){
                                        winningCount1++
                                    }
                                })

                                player2.playingHistory.forEach((ele)=>{
                                    if(ele==winStatus.win){
                                        winningCount2++
                                    }
                                })

                                console.log(winningCount1,winningCount2)
                                if(winningCount1>winningCount2){
                                    this.server.emit('message',`Overall result:Winner is client:${player1.id}`)
                                    return
                                }
                                else if(winningCount1<winningCount2){
                                    this.server.emit('message',`Overall result:Winner is client:${player2.id}`)
                                    return
                                }
                                else{
                                    this.server.emit('message',`Overall result:Tie`)
                                    return
                                }
                                
                            }

           
           }
      
          }     


            
    }



