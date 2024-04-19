const { v4: uuidv4 } = require('uuid'); // For generating unique IDs for each task assignment

/**
 * Simulates assigning tasks to virtual team members based on their expertise.
 * 
 * @param {Array} tasks - The array of decomposed tasks from the user request.
 * @return {Array} The updated tasks array with assigned team member IDs.
 */
function assignTasks(tasks) {
  console.log("Starting task assignment process.");

  // Simulated pool of virtual team members with their roles and expertise
  const teamMembers = [
    { id: uuidv4(), name: "Alice", role: "Frontend Developer", expertise: "Frontend" },
    { id: uuidv4(), name: "Bob", role: "Backend Developer", expertise: "Backend" },
    { id: uuidv4(), name: "Charlie", role: "Database Administrator", expertise: "Database" }
  ];

  // Assign tasks to team members based on expertise
  const assignedTasks = tasks.map(task => {
    try {
      const assignedMember = teamMembers.find(member => member.expertise.toLowerCase() === task.category.toLowerCase());
      if (assignedMember) {
        console.log(`Task "${task.name}" assigned to ${assignedMember.name}`);
        return { ...task, assignedMemberId: assignedMember.id };
      } else {
        console.log(`No team member found with expertise for task "${task.name}". Task remains unassigned.`);
        return { ...task, assignedMemberId: "Unassigned" }; // Ensure task has an 'Unassigned' state if no member matches
      }
    } catch (error) {
      console.error("Error during task assignment:", error.message, error.stack);
      throw error; // Rethrow after logging to ensure the error is not silently ignored.
    }
  });

  console.log("Task assignment process completed.");
  return assignedTasks;
}

module.exports = { assignTasks };