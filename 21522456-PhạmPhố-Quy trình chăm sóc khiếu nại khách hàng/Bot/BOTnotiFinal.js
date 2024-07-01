import { Client, logger } from "camunda-external-task-client-js";
import { Variables } from "camunda-external-task-client-js";
import nodemailer from "nodemailer";

const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger }

const client = new Client(config);
    // email bên gửi 
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: '21522456@gm.uit.edu.vn', // email của bên gửi
        pass: 'ldpj ohqr nahz qqja'
      }
    });
client.subscribe("ketqua", async function({ task, taskService }) {
    const tomail = task.variables.get("fromemail");
    const tenKH = task.variables.get("tenKH");

    const resolvedResult = task.variables.get("kqgp");
    const message = createEmailMessage(resolvedResult, tomail,tenKH);
    
    
    const mailOptions = {
      from:  '21522456@gm.uit.edu.vn',
      to: tomail,
      subject: "Kết Quả Khiếu Nại/Phản ánh của quý khách hàng đến Pharmacity",
      text: resolvedResult,
    }; //nội dung email

  transporter.sendMail(mailOptions,async function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
        const processVariables = new Variables();
        processVariables.set('email',tomail );
        await taskService.complete(task, processVariables);
    }
  })
  
});
function createEmailMessage(resolvedResult, fromEmail) {
  // Customize the email content based on your requirements
  return `Xin chào ${fromEmail},

    Pharmacity xin được phép trả lời vấn đề và giải pháp là: ${resolvedResult}.

    Cảm ơn bạn đã liên hệ Pharmacity.

    Trân trọng,
    Đội ngũ hỗ trợ khách hàng`;
}