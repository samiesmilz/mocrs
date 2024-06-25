import { exec } from "child_process";
import util from "util";

// Promisify the exec function
const execPromise = util.promisify(exec);
const domain = "join.mocrs.com";

/**
 * Registers a new user in Jitsi Meet using the prosodyctl command.
 *
 * @param {string} username - The username of the new user.
 * @param {string} password - The password for the new user.
 * @returns {Promise<string>} - A promise that resolves with the stdout of the prosodyctl command.
 * @throws {Error} - If the prosodyctl command fails, an error is thrown with the stderr.
 */
async function registerJitsiUser(username, password) {
  const command = `prosodyctl register ${username} ${domain} ${password}`;
  return execCommand(command);
}

/**
 * Updates the password of an existing user in Jitsi Meet using the prosodyctl command.
 *
 * @param {string} username - The username of the user to update.
 * @param {string} newPassword - The new password for the user.
 * @returns {Promise<string>} - A promise that resolves with the stdout of the prosodyctl command.
 * @throws {Error} - If the prosodyctl command fails, an error is thrown with the stderr.
 */
async function updateJitsiUserPassword(username, newPassword) {
  const command = `prosodyctl setpass ${username}@${domain} ${newPassword}`;
  return execCommand(command);
}

/**
 * Deletes an existing user from Jitsi Meet using the prosodyctl command.
 *
 * @param {string} username - The username of the user to delete.
 * @returns {Promise<string>} - A promise that resolves with the stdout of the prosodyctl command.
 * @throws {Error} - If the prosodyctl command fails, an error is thrown with the stderr.
 */
async function deleteJitsiUser(username) {
  const command = `prosodyctl deluser ${username}@${domain}`;
  return execCommand(command);
}

/**
 * Executes a shell command and returns the stdout.
 *
 * @param {string} command - The command to execute.
 * @returns {Promise<string>} - A promise that resolves with the stdout of the command.
 * @throws {Error} - If the command fails, an error is thrown.
 */
async function execCommand(command) {
  try {
    const { stdout, stderr } = await execPromise(command);

    // Log both stdout and stderr
    console.log(`stdout: ${stdout}`);
    if (stderr) {
      console.warn(`stderr: ${stderr}`);
      throw new Error(stderr); // Throw an error if stderr is not empty
    }

    return stdout.trim(); // Trim whitespace from stdout
  } catch (error) {
    console.error(`exec error: ${error}`);
    throw new Error(
      `Failed to execute command: ${command}, error: ${error.message}`
    );
  }
}

export { registerJitsiUser, updateJitsiUserPassword, deleteJitsiUser };
