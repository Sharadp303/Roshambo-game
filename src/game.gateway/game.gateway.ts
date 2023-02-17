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
private user=[]
private res=[]

                @SubscribeMessage('game')
                Play(client:Socket,move:String){
            
                if(!this.players.includes(client.id)){
                    this.players.push(client.id)
                   // console.log(this.players)
                }
                
                
                if(this.players.length<=1){   
                    this.input.push(move);
                    this.user.push({client:client.id,move})
                    //console.log(this.user)
                    console.log(client.id,move)
                    this.server.to(client.id).emit('rules',`Your move:${move} \n Waiting for ${2-(this.players.length)} more player`)
                }


                if(this.players.length==2){
                    this.input.push(move);
                    this.user.push({client:client.id,move})
                    //console.log(this.user)
                    console.log(client.id,move)
                    if(this.input.length==2){
                        if(this.input.includes("rock") && this.input.includes("paper")){
                            this.server.emit('results','Winner is Paper!!!!')
                            const ans=this.user.find((ele)=>ele.move==='paper')
                            this.res.push(ans.client)
                            this.input=[]
                        }
                        else if(this.input.includes("rock") && this.input.includes("scissor")){
                            this.server.emit('results','Winner is Rock!!!!')
                            const ans=this.user.find((ele)=>ele.move==='rock')
                            this.res.push(ans.client)
                            this.input=[]
                        }
                        else if(this.input.includes("paper") && this.input.includes("scissor")){
                            this.server.emit('results','Winner is Scissor!!!!')
                            const ans=this.user.find((ele)=>ele.move==='scissor')
                            this.res.push(ans.client)
                            this.input=[]
                        }
                        else{
                            this.server.emit('results','Its a TIE')
                            
                            this.res.push(0)
                            this.input=[]
                        }
                    }
                }
            //console.log(this.res)
                    
                if(this.players.length>=3){
                        this.server.to(client.id).emit('rules',`Room is full wait for some time to join or create a new room`)
                        this.players.pop();
                        console.log(this.players)
                    }
                        if(this.res.length==3){
                        const winner=this.findMaxRepeatedElement(this.res)
                        this.server.emit('rules',`Winner is ${winner} ||||||!!!!! Hurray`)
                        this.res=[];
                        }

            
        }


        private findMaxRepeatedElement(arr) {
            let freq = {}; 
            let maxFreq = 0; 
            let ans="" 
        
            for (let i = 0; i < arr.length; i++) {
            let elem = arr[i];
            if (freq[elem]) {
                freq[elem]++; 
            } else {
                freq[elem] = 1; 
            }
            }
            
            for(let value in freq){
            if(freq[value]>maxFreq){
                maxFreq=freq[value]
                ans=value
            }
                }
        
            return ans; 
        }
            
    }


