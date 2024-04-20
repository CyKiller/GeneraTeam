const mongoose = require('mongoose');
const Sentiment = require('sentiment');
const Chat = require('../models/Chat');
const Feedback = require('../models/Feedback');
const Task = require('../models/Task');
const Team = require('../models/Team');

const sentiment = new Sentiment();

// Function to analyze chat interactions and store feedback
async function analyzeChatFeedback(requestId) {
  try {
    console.log(`Starting analysis of chat feedback for requestId: ${requestId}`);
    const chat = await Chat.findOne({ requestId: requestId });
    if (!chat) {
      console.error(`Chat not found for requestId: ${requestId}`);
      throw new Error('Chat not found');
    }

    let totalSentimentScore = 0;
    chat.messages.forEach(message => {
      const result = sentiment.analyze(message.messageText);
      totalSentimentScore += result.score;
    });

    const averageSentimentScore = totalSentimentScore / chat.messages.length;
    let userSatisfaction = 'neutral';
    if (averageSentimentScore > 0) userSatisfaction = 'positive';
    else if (averageSentimentScore < 0) userSatisfaction = 'negative';

    // Fetch existing feedback if any
    const existingFeedback = await Feedback.findOne({ requestId: requestId });
    if (existingFeedback) {
      console.log(`Updating existing feedback for requestId: ${requestId}`);
      existingFeedback.sentimentScore = averageSentimentScore;
      existingFeedback.userSatisfaction = userSatisfaction;
      await existingFeedback.save();
    } else {
      const feedback = new Feedback({
        requestId,
        userSatisfaction,
        sentimentScore: averageSentimentScore,
      });
      await feedback.save();
      console.log(`Feedback saved for requestId: ${requestId} with user satisfaction: ${userSatisfaction}`);
    }

    console.log('Placeholder for future implementation to adjust team generation based on feedback trends.');
  } catch (error) {
    console.error('Error analyzing chat feedback:', error.message, error.stack);
  }
}

async function adjustTaskAssignmentAndTeamGeneration(requestId, feedback) {
  console.log(`Adjusting task assignment and team generation for requestId: ${requestId} based on feedback`);
  
  // Placeholder logic for adjusting task assignment based on feedback
  // This could involve querying the Task model to find tasks related to the requestId and reassigning them
  // Example:
  // const tasks = await Task.find({ requestId: requestId });
  // tasks.forEach(async (task) => {
  //   task.assignedMemberId = newMemberId; // Determine newMemberId based on feedback analysis
  //   await task.save();
  // });

  // Placeholder logic for adjusting team generation based on feedback
  // This could involve querying the Team model to adjust team member roles or adding/removing members
  // Example:
  // const team = await Team.findOne({ requestId: requestId });
  // team.members.push(newMember); // Determine newMember based on feedback analysis
  // await team.save();

  console.log('Task assignment and team generation adjusted based on feedback.');
}

module.exports = { analyzeChatFeedback, adjustTaskAssignmentAndTeamGeneration };