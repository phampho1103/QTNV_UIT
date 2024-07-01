import { Client, logger, Variables } from "camunda-external-task-client-js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const config = {
  baseUrl: "http://localhost:8080/engine-rest",
  use: logger,
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '21522456@gm.uit.edu.vn', // Get email from environment variable
    pass: 'ldpj ohqr nahz qqja'
  }
});

const client = new Client(config);

client.subscribe("FormXulyKTBot", async function ({ task, taskService }) {

  client.on('subscribe', (topic) => {
    console.log(`Subscribed to topic: ${topic}`);
  });

  const taskId = task.id; 
  console.log("Task ID:", taskId); 

  // Fetch Variables (Defensive Coding)
  const Masp = task.variables.get("masp") || "";
  const NgayLap = task.variables.get("ngaylap") || "";
  const Thieuthuoc = task.variables.get("thieuthuoc") || false;
  const KhacHoaDon = task.variables.get("khachoadon") || false;
  const HuVoNat = task.variables.get("huvonat") || false;
  const LyDoKhac = task.variables.get("lydokhac") || "";
  const CheckNumber = task.variables.get("checknumber") || 0;

  // Email Content (Inline CSS for better compatibility)
  const content = `
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-radius: 10px;">
      <h2 style="color: #3498db;">Phiếu kiểm tra BM-KT-011</h2>
      <h2 style="color: #3498db;">Pharmacity thông tin đến bạn về phiếu kiểm tra</h2>
      <table style="width:70%; margin: 0 auto; border-collapse: collapse; border: 1px solid #ddd; background-color: #fff;">
        <tr>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f2f2f2;">Mã sản phẩm</th>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${Masp}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f2f2f2;">Ngày lập</th>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${NgayLap}</td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f2f2f2;">Lí do</th>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">
            <ul style="list-style: none; padding: 0; margin: 0; text-align: left;">
              ${Thieuthuoc ? "<li>🔍 Thiếu thuốc</li>" : ""}
              ${KhacHoaDon ? "<li>🔍 Thuốc khác hóa đơn</li>" : ""}
              ${HuVoNat ? "<li>🔍 Thuốc bị hư, vỡ, nát</li>" : ""}
              ${LyDoKhac ? `<li>🔍 ${LyDoKhac}</li>` : ""}
            </ul>
          </td>
        </tr>
        <tr>
          <th style="border: 1px solid #ddd; padding: 10px; text-align: center; background-color: #f2f2f2;">Số lần kiểm tra</th>
          <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${CheckNumber}</td>
        </tr>
      </table>
    </div>
  `;

  const mailOptions = {
    from: '21522456@gm.uit.edu.vn',
    to: 'anhnguyetbis@gmail.com', // Or get recipient email from Camunda variables
    subject: 'Phiếu kiểm tra BM-KT-011',
    html: content,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    // Implement more robust error handling here if needed
  }

  await taskService.complete(task, new Variables());
});
