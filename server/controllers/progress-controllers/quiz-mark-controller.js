const User = require('../../models/User');



// Update quiz results and auto-calculate understanding level
exports.updateQuizMarks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, correct, wrong, total } = req.body;

    if (!topic || !subtopic) {
      return res.status(400).json({
        success: false,
        message: "Topic and subtopic are required"
      });
    }

    if (correct === undefined || wrong === undefined || total === undefined) {
      return res.status(400).json({
        success: false,
        message: "Correct, wrong, and total counts are required"
      });
    }

    if (correct < 0 || wrong < 0 || total < 0) {
      return res.status(400).json({
        success: false,
        message: "Quiz counts cannot be negative"
      });
    }

    if (correct + wrong > total) {
      return res.status(400).json({
        success: false,
        message: "Correct + wrong cannot exceed total questions"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const topicIndex = user.progress.findIndex(
      progress => progress.topic.toLowerCase() === topic.toLowerCase()
    );

    if (topicIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Topic "${topic}" not found in user progress`
      });
    }

    const subtopicIndex = user.progress[topicIndex].subTopics.findIndex(
      sub => sub.name.toLowerCase() === subtopic.toLowerCase()
    );

    if (subtopicIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Subtopic "${subtopic}" not found in topic "${topic}"`
      });
    }

    // Calculate quiz percentage
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Update quiz marks with timestamp
    user.progress[topicIndex].subTopics[subtopicIndex].quizMark = {
      correct,
      wrong,
      total,
      percentage,
      submittedAt: new Date()
    };

    // Auto-update understanding level based on quiz performance
    let understandingLevel;
    if (percentage >= 80) understandingLevel = 5; // Excellent
    else if (percentage >= 60) understandingLevel = 4; // Good
    else if (percentage >= 40) understandingLevel = 3; // Average
    else if (percentage >= 20) understandingLevel = 2; // Poor
    else understandingLevel = 1; // Very Poor

    user.progress[topicIndex].subTopics[subtopicIndex].understandingLevel = understandingLevel;
    
    // Auto-complete subtopic if score is good (70% or above)
    if (percentage >= 70) {
      user.progress[topicIndex].subTopics[subtopicIndex].completed = true;
    }

    user.progress[topicIndex].subTopics[subtopicIndex].lastReviewed = new Date();
    user.progress[topicIndex].lastAccessed = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: `Quiz marks updated for "${subtopic}"`,
      data: {
        topic,
        subtopic,
        quizMark: user.progress[topicIndex].subTopics[subtopicIndex].quizMark,
        understandingLevel,
        completed: user.progress[topicIndex].subTopics[subtopicIndex].completed
      }
    });

  } catch (error) {
    console.error("Error updating quiz marks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update quiz marks",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get quiz marks for review and analytics
exports.getQuizMarks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.query;

    if (!topic || !subtopic) {
      return res.status(400).json({
        success: false,
        message: "Topic and subtopic query parameters are required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const topicProgress = user.progress.find(
      progress => progress.topic.toLowerCase() === topic.toLowerCase()
    );

    if (!topicProgress) {
      return res.status(404).json({
        success: false,
        message: `Topic "${topic}" not found in user progress`
      });
    }

    const subtopicProgress = topicProgress.subTopics.find(
      sub => sub.name.toLowerCase() === subtopic.toLowerCase()
    );

    if (!subtopicProgress) {
      return res.status(404).json({
        success: false,
        message: `Subtopic "${subtopic}" not found in topic "${topic}"`
      });
    }

    res.status(200).json({
      success: true,
      data: {
        topic,
        subtopic,
        quizMark: subtopicProgress.quizMark || null,
        hasQuizMarks: !!subtopicProgress.quizMark
      }
    });

  } catch (error) {
    console.error("Error getting quiz marks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get quiz marks",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Clear quiz marks (useful for retaking quizzes)
exports.clearQuizMarks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    if (!topic || !subtopic) {
      return res.status(400).json({
        success: false,
        message: "Topic and subtopic are required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const topicIndex = user.progress.findIndex(
      progress => progress.topic.toLowerCase() === topic.toLowerCase()
    );

    if (topicIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Topic "${topic}" not found in user progress`
      });
    }

    const subtopicIndex = user.progress[topicIndex].subTopics.findIndex(
      sub => sub.name.toLowerCase() === subtopic.toLowerCase()
    );

    if (subtopicIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Subtopic "${subtopic}" not found in topic "${topic}"`
      });
    }

    // Clear quiz marks but keep other progress data
    user.progress[topicIndex].subTopics[subtopicIndex].quizMark = undefined;
    user.progress[topicIndex].lastAccessed = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: `Quiz marks cleared for "${subtopic}"`,
      data: {
        topic,
        subtopic
      }
    });

  } catch (error) {
    console.error("Error clearing quiz marks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear quiz marks",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

