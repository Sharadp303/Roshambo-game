import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { EmailController } from "./email.controller";
import { EmailService } from "./email.service";

@Module({
imports:[MailerModule.forRoot({
    transport:{
        host:'smtp.gmail.com',
        auth:{
            user:'sharad.patels03@gmail.com',
            pass:'aadnbokwimjerikq'
        },
        secure:true

    }
})],
controllers:[EmailController],
providers:[EmailService]
})

export class EmailModule{}