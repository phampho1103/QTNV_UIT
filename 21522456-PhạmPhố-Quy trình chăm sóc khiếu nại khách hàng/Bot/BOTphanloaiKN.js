import { Client, logger } from "camunda-external-task-client-js";
import { Variables } from "camunda-external-task-client-js";

const config = { baseUrl: "http://localhost:8080/engine-rest",
use: logger
 };

// Create a Client instance with custom configuration
const client = new Client(config);

// Subscribe to the topic: 'classificationKN'
client.subscribe("classificationKN", async function ({ task, taskService }) {
  // Put your business logic
  try {
    // Get complaint text from process variable
    const complaint = task.variables.get("phieuKN");

    // Classify the complaint
    const category = classifyComplaint(complaint);

    const processVariables = new Variables();
    processVariables.set("classificationResult", category);

    await taskService.complete(task, processVariables);
  } catch (error) {
    await taskService.handleFailure(task, {
      errorMessage: error.message,
    });
  }
});

// Function to classify the complaint
function classifyComplaint(complaint) {
    const keywords = {
      'sản phẩm' : ['sản phẩm', 'hàng hóa',' vận chuyển', 'giao hàng' ],
      'thanh toán' : ['chậm', 'phương thức thanh toán', 'trừ tiền']
    };
    const categoryCount = [];
    for (const category in keywords) {
      for (const keyword of keywords[category]) {
        if (complaint.toLowerCase().includes(keyword)) {
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        }
      }
    }

    const maxCountCategory = Object.keys(categoryCount).reduce((a, b) => (categoryCount[a] > categoryCount[b] ? a : b), null);

    return maxCountCategory || null;
}
