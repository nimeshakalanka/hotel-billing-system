const { spawn } = require("child_process");
const path = require("path");

exports.generatePDF = async (billData, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const pythonPath = "python"; // or "python3" depending on your system
      const scriptPath = path.join(__dirname, "../../../python_pdf/generate_pdf.py");

      console.log("🪶 Running Python script:", scriptPath);

      const process = spawn(pythonPath, [scriptPath, JSON.stringify(billData), outputPath]);

      process.stdout.on("data", (data) => {
        console.log(`🐍 Python: ${data}`);
      });

      process.stderr.on("data", (data) => {
        console.error(`❌ Python Error: ${data}`);
        console.error("👉 Script Path:", scriptPath);
        console.error("👉 Output Path:", outputPath);
        console.error("👉 Python Executable:", pythonPath);

      });

      process.on("close", (code) => {
        if (code === 0) {
          console.log("✅ PDF generated successfully:", outputPath);
          resolve(outputPath);
        } else {
          reject(new Error("Failed to generate PDF"));
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};
