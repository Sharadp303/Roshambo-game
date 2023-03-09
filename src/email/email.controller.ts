import { MailerService } from "@nestjs-modules/mailer";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { join } from "path";



@Controller('email')
export class EmailController{
constructor(private readonly mailservice:MailerService){}
@Get()
async touser(@Query('toemail') toemail){
    await this.mailservice.sendMail({
        to:toemail,
        from:'sharad.patels03@gmail.com',
        subject:"testing mail service",
        html:'<h1>Hii this is Sharad</h1>',
        attachments:[{
            path:join(__dirname,'Attachments','k.txt'),
            filename:'1.txt',
            contentDisposition:'attachment'
        }],
    })
    return 'success';
}

@Post()
async multipleuser(@Body('email') email:string){
    console.log(email)
    let ans=email;
  let newwmails= ans.split(",")

    await newwmails.forEach(async (ele)=>{
        await this.mailservice.sendMail({
            to:ele,
            from:'sharad.patels03@gmail.com',
            subject:"testing mail service",
            html:'<h1>Hii this is Sharad</h1>',
            attachments:[{
                path:join(__dirname,'Attachments','k.txt'),
                filename:'1.txt',
                contentDisposition:'attachment'
            }],
        })
    })
    
    
    
     return "success";
    

}

}