
import { Client, logger } from "camunda-external-task-client-js";
import { Variables } from "camunda-external-task-client-js";
import exceljs from "exceljs";
const workbook = new exceljs.Workbook();
const excelFilePath = 'saveKH.xlsx';

const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };


const client = new Client(config);

client.subscribe("themexcel", async function ({ task, taskService }) {
  const tenKH = task.variables.get("tenKH");
  const complaint = task.variables.get("phieuKN");
  await workbook.xlsx.readFile(excelFilePath)
    .then(() => {
        const worksheet = workbook.getWorksheet('Sheet1');
        const newRowNumber = worksheet.lastRow ? worksheet.lastRow.number + 1 : 1;
  
        worksheet.getCell(`A${newRowNumber}`).value = tenKH;
        worksheet.getCell(`B${newRowNumber}`).value = complaint;

        console.log('123');
    return workbook.xlsx.writeFile('../saveKH.xlsx');
  })
  .then(async () => {
    console.log('Thêm vào file excel thành công')
    const processVariables = new Variables();
    await taskService.complete(task, processVariables);
  })
  .catch(err => {
    console.log(err.message)
  })
  
});