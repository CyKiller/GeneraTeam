/**
 * Decomposes a user request into manageable tasks.
 * 
 * @param {string} requestText - The full text of the user request.
 * @return {Array} An array of task objects.
 */
function decomposeRequest(requestText) {
  console.log("Decomposing request:", requestText);

  // Define patterns for task identification
  const patterns = {
    frontend: /frontend|UI|UX|user interface|web design/gi,
    backend: /backend|server|API|database/gi,
    database: /database|MongoDB|SQL|data storage/gi
  };

  // Define a structure to hold the identified tasks
  let tasks = [];

  try {
    // Identify frontend tasks
    if (requestText.match(patterns.frontend)) {
      tasks.push({ name: "Frontend Development", category: "Frontend", description: "Develop the user interface and experience." });
      console.log("Frontend task identified.");
    }

    // Identify backend tasks
    if (requestText.match(patterns.backend)) {
      tasks.push({ name: "Backend Development", category: "Backend", description: "Implement server-side logic and APIs." });
      console.log("Backend task identified.");
    }

    // Identify database tasks
    if (requestText.match(patterns.database)) {
      tasks.push({ name: "Database Management", category: "Database", description: "Design and manage the data storage solution." });
      console.log("Database task identified.");
    }
  } catch (error) {
    console.error("Error decomposing request:", error.message, error.stack);
    throw error; // Rethrow after logging to ensure the error is not silently ignored.
  }

  // Return the array of identified tasks
  console.log("Tasks decomposed:", tasks);
  return tasks;
}

module.exports = { decomposeRequest };