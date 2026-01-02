const User = require('../models/User');

// Add or update a topic with subtopic in user progress (used when starting new content)
exports.addOrUpdateTopic = async (req, res) => {
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

    let topicIndex = user.progress.findIndex(
      progress => progress.topic.toLowerCase() === topic.toLowerCase()
    );

    // Create new topic if it doesn't exist
    if (topicIndex === -1) {
      user.progress.push({
        topic,
        subTopics: [],
        overallUnderstanding: 3, // Default to average understanding
        lastAccessed: new Date()
      });
      topicIndex = user.progress.length - 1;
    }

    // Check if subtopic exists
    const subtopicIndex = user.progress[topicIndex].subTopics.findIndex(
      sub => sub.name.toLowerCase() === subtopic.toLowerCase()
    );

    // Add subtopic if it doesn't exist
    if (subtopicIndex === -1) {
      user.progress[topicIndex].subTopics.push({
        name: subtopic,
        completed: false,
        understandingLevel: 0, // Start at 0 for new subtopics
        generationCount: 0,
        lastReviewed: new Date()
      });
    }

    user.progress[topicIndex].lastAccessed = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: `Progress updated for "${subtopic}" in "${topic}"`,
      data: {
        topic,
        subtopic,
        wasNewTopic: topicIndex === user.progress.length - 1
      }
    });

  } catch (error) {
    console.error("Error adding/updating topic:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update progress",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all progress data for the user (dashboard overview)
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('progress');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Calculate progress statistics
    const totalSubtopics = user.progress.reduce((total, topic) => total + topic.subTopics.length, 0);
    const completedSubtopics = user.progress.reduce((total, topic) => 
      total + topic.subTopics.filter(sub => sub.completed).length, 0
    );

    res.status(200).json({
      success: true,
      data: {
        progress: user.progress,
        totalTopics: user.progress.length,
        totalSubtopics,
        completedSubtopics
      }
    });

  } catch (error) {
    console.error("Error getting user progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user progress",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update understanding level (1-5 scale) for self-assessment
exports.updateUnderstandingLevel = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, understandingLevel } = req.body;

    if (!topic || !subtopic || understandingLevel === undefined) {
      return res.status(400).json({
        success: false,
        message: "Topic, subtopic, and understanding level are required"
      });
    }

    if (understandingLevel < 1 || understandingLevel > 5) {
      return res.status(400).json({
        success: false,
        message: "Understanding level must be between 1 and 5"
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

    user.progress[topicIndex].subTopics[subtopicIndex].understandingLevel = understandingLevel;
    user.progress[topicIndex].subTopics[subtopicIndex].lastReviewed = new Date();
    user.progress[topicIndex].lastAccessed = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: `Understanding level updated to ${understandingLevel} for "${subtopic}"`,
      data: {
        topic,
        subtopic,
        understandingLevel
      }
    });

  } catch (error) {
    console.error("Error updating understanding level:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update understanding level",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



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




// Mark topic as completed or incomplete
exports.markTopicComplete = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, completed = true } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required"
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

    // Update topic completion status
    user.progress[topicIndex].completed = completed;
    user.progress[topicIndex].lastAccessed = new Date();

    // If marking as completed, also mark all subtopics as completed
    if (completed) {
      user.progress[topicIndex].subTopics.forEach(subtopic => {
        subtopic.completed = true;
        subtopic.lastReviewed = new Date();
      });
      
      // Calculate overall understanding based on completed subtopics
      const completedSubtopics = user.progress[topicIndex].subTopics.filter(sub => sub.completed);
      if (completedSubtopics.length > 0) {
        const totalUnderstanding = completedSubtopics.reduce((sum, sub) => sum + (sub.understandingLevel || 3), 0);
        user.progress[topicIndex].overallUnderstanding = Math.round(totalUnderstanding / completedSubtopics.length);
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `Topic "${topic}" ${completed ? 'marked as completed' : 'marked as incomplete'}`,
      data: {
        topic,
        completed,
        overallUnderstanding: user.progress[topicIndex].overallUnderstanding,
        completedSubtopics: user.progress[topicIndex].subTopics.filter(sub => sub.completed).length,
        totalSubtopics: user.progress[topicIndex].subTopics.length
      }
    });

  } catch (error) {
    console.error("Error marking topic complete:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update topic completion status",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



// Mark subtopic as completed or incomplete (with auto-topic completion)
exports.markSubtopicComplete = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, completed = true } = req.body;

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

    // Update subtopic
    user.progress[topicIndex].subTopics[subtopicIndex].completed = completed;
    user.progress[topicIndex].subTopics[subtopicIndex].lastReviewed = new Date();
    user.progress[topicIndex].lastAccessed = new Date();

    await user.save();

    // Auto-check topic completion
    const topicUpdate = await exports.autoUpdateTopicCompletion(userId, topic);

    const response = {
      success: true,
      message: `Subtopic "${subtopic}" ${completed ? 'marked as completed' : 'marked as incomplete'}`,
      data: {
        topic,
        subtopic,
        completed,
        topicAutoCompleted: topicUpdate?.autoUpdated || false
      }
    };

    // Include topic update info if auto-completed
    if (topicUpdate) {
      response.topicUpdate = topicUpdate;
    }

    res.status(200).json(response);

  } catch (error) {
    console.error("Error marking subtopic complete:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update completion status",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};