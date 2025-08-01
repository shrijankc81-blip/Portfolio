#!/usr/bin/env node

const { program } = require("commander");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

program
  .name("kill-port")
  .description("Kill process using a specific port")
  .version("1.0.0");

program
  .argument("<port>", "Port number to kill")
  .option("-f, --force", "Force kill without confirmation")
  .action(async (port, options) => {
    const portNumber = parseInt(port);
    
    if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
      console.error("❌ Invalid port number. Must be between 1 and 65535");
      process.exit(1);
    }

    try {
      console.log(`🔍 Checking for processes using port ${portNumber}...`);
      
      // Check what's using the port
      let processInfo = null;
      try {
        if (process.platform === "win32") {
          // Windows command
          const { stdout } = await execAsync(`netstat -ano | findstr :${portNumber}`);
          if (stdout.trim()) {
            const lines = stdout.trim().split('\n');
            const pidMatch = lines[0].match(/\s+(\d+)$/);
            if (pidMatch) {
              const pid = pidMatch[1];
              try {
                const { stdout: taskInfo } = await execAsync(`tasklist /FI "PID eq ${pid}" /FO CSV`);
                processInfo = `PID ${pid} (${taskInfo.split('\n')[1]?.split(',')[0]?.replace(/"/g, '') || 'Unknown'})`;
              } catch {
                processInfo = `PID ${pid}`;
              }
            }
          }
        } else {
          // Unix/Linux/Mac command
          const { stdout } = await execAsync(`lsof -ti:${portNumber}`);
          const pid = stdout.trim();
          
          if (pid) {
            try {
              const { stdout: processName } = await execAsync(`ps -p ${pid} -o comm=`);
              processInfo = `PID ${pid} (${processName.trim()})`;
            } catch {
              processInfo = `PID ${pid}`;
            }
          }
        }
      } catch (error) {
        // No process found or command failed
      }

      if (!processInfo) {
        console.log(`✅ No process found using port ${portNumber}`);
        return;
      }

      console.log(`📋 Found process: ${processInfo}`);

      // Ask for confirmation unless force flag is used
      if (!options.force) {
        const readline = require("readline");
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        const answer = await new Promise((resolve) => {
          rl.question(`⚠️  Kill process ${processInfo}? (y/N): `, resolve);
        });

        rl.close();

        if (answer.toLowerCase() !== "y" && answer.toLowerCase() !== "yes") {
          console.log("❌ Operation cancelled");
          return;
        }
      }

      // Kill the process
      console.log(`🔪 Killing process using port ${portNumber}...`);
      
      if (process.platform === "win32") {
        // Windows: Kill by port
        await execAsync(`for /f "tokens=5" %a in ('netstat -aon ^| findstr :${portNumber}') do taskkill /f /pid %a`);
      } else {
        // Unix/Linux/Mac: Kill by port
        await execAsync(`lsof -ti:${portNumber} | xargs kill -9`);
      }

      console.log(`✅ Successfully killed process using port ${portNumber}`);
      
    } catch (error) {
      if (error.message.includes("No such process")) {
        console.log(`✅ No process found using port ${portNumber}`);
      } else {
        console.error(`❌ Error killing process: ${error.message}`);
        process.exit(1);
      }
    }
  });

// Add a command to kill common development ports
program
  .command("dev")
  .description("Kill common development ports (3000, 5000, 8000)")
  .option("-f, --force", "Force kill without confirmation")
  .action(async (options) => {
    const commonPorts = [3000, 5000, 8000];
    
    console.log("🔍 Checking common development ports...");
    
    for (const port of commonPorts) {
      try {
        let hasProcess = false;
        
        if (process.platform === "win32") {
          const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
          hasProcess = stdout.trim().length > 0;
        } else {
          const { stdout } = await execAsync(`lsof -ti:${port}`);
          hasProcess = stdout.trim().length > 0;
        }
        
        if (hasProcess) {
          console.log(`🔪 Killing process on port ${port}...`);
          
          if (process.platform === "win32") {
            await execAsync(`for /f "tokens=5" %a in ('netstat -aon ^| findstr :${port}') do taskkill /f /pid %a`);
          } else {
            await execAsync(`lsof -ti:${port} | xargs kill -9`);
          }
          
          console.log(`✅ Killed process on port ${port}`);
        } else {
          console.log(`✅ Port ${port} is free`);
        }
      } catch (error) {
        console.log(`✅ Port ${port} is free`);
      }
    }
    
    console.log("🎉 Development ports cleanup completed");
  });

program.parse();

// Handle no command
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
