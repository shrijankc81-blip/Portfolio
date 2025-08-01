const net = require("net");

/**
 * Check if a port is available
 * @param {number} port - Port number to check
 * @returns {Promise<boolean>} - True if port is available
 */
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.listen(port, () => {
      server.once("close", () => {
        resolve(true);
      });
      server.close();
    });

    server.on("error", () => {
      resolve(false);
    });
  });
};

/**
 * Find an available port starting from a given port
 * @param {number} startPort - Starting port number
 * @param {number} maxAttempts - Maximum number of ports to try
 * @returns {Promise<number>} - Available port number
 */
const findAvailablePort = async (startPort = 5000, maxAttempts = 10) => {
  // Ensure startPort is a number
  const basePort = parseInt(startPort);

  if (isNaN(basePort) || basePort < 1 || basePort > 65535) {
    throw new Error(
      `Invalid start port: ${startPort}. Must be between 1 and 65535`
    );
  }

  for (let i = 0; i < maxAttempts; i++) {
    const port = basePort + i;

    // Make sure we don't exceed valid port range
    if (port > 65535) {
      throw new Error(`Port range exceeded. Cannot check port ${port}`);
    }

    const available = await isPortAvailable(port);

    if (available) {
      return port;
    }
  }

  throw new Error(
    `No available port found after checking ${maxAttempts} ports starting from ${basePort}`
  );
};

/**
 * Get process information for a port (Linux/Mac only)
 * @param {number} port - Port number
 * @returns {Promise<string|null>} - Process information or null
 */
const getPortProcess = async (port) => {
  try {
    const { exec } = require("child_process");
    const { promisify } = require("util");
    const execAsync = promisify(exec);

    // This works on Linux/Mac, for Windows you'd need different command
    const { stdout } = await execAsync(`lsof -ti:${port}`);
    const pid = stdout.trim();

    if (pid) {
      const { stdout: processInfo } = await execAsync(`ps -p ${pid} -o comm=`);
      return `PID ${pid} (${processInfo.trim()})`;
    }

    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Kill process using a port (Linux/Mac only)
 * @param {number} port - Port number
 * @returns {Promise<boolean>} - True if successful
 */
const killPortProcess = async (port) => {
  try {
    const { exec } = require("child_process");
    const { promisify } = require("util");
    const execAsync = promisify(exec);

    await execAsync(`lsof -ti:${port} | xargs kill -9`);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Start server with automatic port finding
 * @param {object} app - Express app
 * @param {number} preferredPort - Preferred port number
 * @param {function} callback - Callback function when server starts
 * @returns {Promise<object>} - Server instance and port
 */
const startServerWithPortFinding = async (
  app,
  preferredPort = 5000,
  callback
) => {
  try {
    // Ensure preferredPort is a number
    const port = parseInt(preferredPort);

    if (isNaN(port) || port < 1 || port > 65535) {
      throw new Error(
        `Invalid preferred port: ${preferredPort}. Must be between 1 and 65535`
      );
    }

    // First try the preferred port
    const isPreferredAvailable = await isPortAvailable(port);

    if (isPreferredAvailable) {
      const server = app.listen(port, callback);
      return { server, port };
    }

    // If preferred port is not available, find an alternative
    console.log(`⚠️  Port ${port} is not available, finding alternative...`);

    const nextPort = parseInt(port) + 1;
    const availablePort = await findAvailablePort(nextPort);
    console.log(`✅ Found available port: ${availablePort}`);

    const server = app.listen(availablePort, () => {
      if (callback) callback();
      console.log(`📝 Note: Using port ${availablePort} instead of ${port}`);
    });

    return { server, port: availablePort };
  } catch (error) {
    throw new Error(`Failed to start server: ${error.message}`);
  }
};

module.exports = {
  isPortAvailable,
  findAvailablePort,
  getPortProcess,
  killPortProcess,
  startServerWithPortFinding,
};
