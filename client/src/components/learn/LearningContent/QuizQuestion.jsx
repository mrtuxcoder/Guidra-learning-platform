import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  RadioGroup,
  Box,
} from "@mui/material";
import { ExpandMore, CheckCircle, Cancel } from "@mui/icons-material";
import AnswerOption from "./AnswerOption";

const QuizQuestion = ({
  quizItem,
  index,
  userAnswer,
  quizSubmitted,
  onAnswer,
  isMobile,
  colorPalette,
}) => {
  const question =
    typeof quizItem === "string" ? { question: quizItem } : quizItem;

  const getAnswerStatus = (option) => {
    if (!quizSubmitted) return "default";

    const correctAnswer =
      question.choices?.[question.correctIndex] || question.answer;
    if (option === correctAnswer) return "correct";
    if (option === userAnswer && userAnswer !== correctAnswer) return "wrong";
    return "default";
  };

  return (
    <Accordion
      key={index}
      sx={{
        mb: 1,
        borderRadius: 1,
        border: `1px solid ${colorPalette[100]}`,
        background: "white",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore sx={{ color: colorPalette[500] }} />}
        sx={{ borderRadius: 1 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Typography
            variant="body2"
            fontWeight="600"
            sx={{
              flex: 1,
              color: colorPalette[700],
              fontSize: isMobile ? "0.8rem" : "0.875rem",
            }}
          >
            {question.question || quizItem}
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        {question.options || question.choices ? (
          <RadioGroup
            value={userAnswer || ""}
            onChange={(e) => !quizSubmitted && onAnswer(index, e.target.value)}
          >
            {(question.options || question.choices).map((option, optIndex) => {
              const answerStatus = getAnswerStatus(option);

              return (
                <AnswerOption
                  key={optIndex}
                  option={option}
                  value={option}
                  disabled={quizSubmitted}
                  answerStatus={answerStatus}
                  onSelect={() => !quizSubmitted && onAnswer(index, option)}
                  isMobile={isMobile}
                  colorPalette={colorPalette}
                />
              );
            })}
          </RadioGroup>
        ) : (
          <Box sx={{ textAlign: "center", p: 2 }}>
            <Button
              variant="outlined"
              onClick={() =>
                !quizSubmitted && !userAnswer && onAnswer(index, "Reflected")
              }
              disabled={quizSubmitted || userAnswer}
              size={isMobile ? "small" : "medium"}
              sx={{
                borderColor: colorPalette[500],
                color: colorPalette[500],
              }}
            >
              {userAnswer ? "✓ Reflected" : "Mark as Reflected"}
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default QuizQuestion;
