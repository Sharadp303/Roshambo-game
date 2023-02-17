import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { SubscribeMessage } from "@nestjs/websockets/decorators";
import{Server,Socket} from 'socket.io'                                         


@WebSocketGateway()
export class RoshamboGateway implements OnGatewayInit, OnGatewayConnection,OnGatewayDisconnect{
    
    @WebSocketServer()
    server:Server
    afterInit(server: any) {
        console.log('websocket initiated')
    }
    handleConnection(client: any, ...args: any[]) {
        console.log(`Welcome to Roshamo ${"\n"}  User:${client.id}`)
        
    }
   
    handleDisconnect(client: any) {
       console.log(`DisConnected User:${client.id}`)
    }

private players=[];
private input=[];
//private user=[]

                @SubscribeMessage('game')
                Play(client:Socket,move:String){
            
                if(!this.players.includes(client.id))
                {this.players.push(client.id)
                console.log(this.players)}
                
                
                if(this.players.length<=1){   
                    this.input.push(move);
                    //this.user.push({client:client.id,move,winning:0})
                    //console.log(this.user)
                    console.log(move,this.input)
                this.server.to(client.id).emit('rules',`Your move:${move} \n Waiting for ${2-(this.players.length)} more player`)
                }

                if(this.players.length==2){
                    this.input.push(move);
                    console.log(move,this.input)
                    if(this.input.length==2){
                        if(this.input.includes("rock") && this.input.includes("paper")){
                            this.server.emit('results','Winner is Paper!!!!')
                            this.input=[]
                        }
                        else if(this.input.includes("rock") && this.input.includes("scissor")){
                            this.server.emit('results','Winner is Rock!!!!')
                            this.input=[]
                        }
                        else if(this.input.includes("paper") && this.input.includes("scissor")){
                            this.server.emit('results','Winner is Scissor!!!!')
                            this.input=[]
                        }
                        else{
                            this.server.emit('results','Its a TIE')
                            this.input=[]
                        }
                    }
                }
            
                    
                if(this.players.length>=3){
                        this.server.to(client.id).emit('rules',`Room is full wait for some time to join or create a new room`)
                        this.players.pop();
                        console.log(this.players)
                    }
            }



}
