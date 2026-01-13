// Utility functions for LearningContent

export const processQuizResults = (quizItems, quizAnswers) => {
  let correct = 0;
  let wrong = 0;

  quizItems.forEach((question, index) => {
    if (quizAnswers[index] !== undefined) {
      const currentQuestion =
        typeof question === "string" ? { choices: [] } : question;
      const correctAnswer =
        currentQuestion.choices?.[currentQuestion.correctIndex] ||
        currentQuestion.answer;

      if (quizAnswers[index] === correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    }
  });

  const total = correct + wrong;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return { correct, wrong, total, percentage };
};

export const validateQuizSubmission = (quizAnswers, totalQuestions) => {
  return Object.keys(quizAnswers).length === totalQuestions;
};

export const getAnswerStatus = (question, userAnswer, option) => {
  const correctAnswer =
    question.choices?.[question.correctIndex] || question.answer;

  if (option === correctAnswer) return "correct";
  if (option === userAnswer && userAnswer !== correctAnswer) return "wrong";
  return "default";
};
