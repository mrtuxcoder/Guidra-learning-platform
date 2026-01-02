
const User = require('../../models/User');


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