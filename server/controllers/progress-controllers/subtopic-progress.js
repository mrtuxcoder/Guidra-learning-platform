
const User = require('../../models/User');


exports.updateSubtopicProgressController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopicName, completed, understandingLevel } = req.body;

    if (!topic || !subtopicName)
      return res.status(400).json({ message: "Topic and subtopicName are required." });

    // Validate understanding level range
    if (understandingLevel && (understandingLevel < 1 || understandingLevel > 5))
      return res.status(400).json({ message: "understandingLevel must be between 1 and 5." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find the topic progress
    const topicProgress = user.progress.find((p) => p.topic === topic);
    if (!topicProgress)
      return res.status(404).json({ message: "Topic not found in progress." });

    // Find the specific subtopic
    const subtopic = topicProgress.subTopics.find(
      (s) => s.name.toLowerCase() === subtopicName.toLowerCase()
    );

    if (!subtopic)
      return res.status(404).json({ message: "Subtopic not found under this topic." });

    // Update subtopic properties if provided
    if (completed !== undefined) subtopic.completed = completed;
    if (understandingLevel !== undefined) subtopic.understandingLevel = understandingLevel;

    subtopic.lastReviewed = new Date();

    // Mark topic as completed if all subtopics are completed
    if (topicProgress.subTopics.every((s) => s.completed)) topicProgress.completed = true;

    await user.save();

    res.status(200).json({
      message: `Subtopic "${subtopic.name}" updated successfully.`,
      data: {
        topic: topicProgress.topic,
        subtopic: subtopic.name,
        completed: subtopic.completed,
        understandingLevel: subtopic.understandingLevel,
      },
    });
  } catch (error) {
    console.error("Error in updateSubtopicProgressController:", error);
    res.status(500).json({ message: "Failed to update subtopic progress" });
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