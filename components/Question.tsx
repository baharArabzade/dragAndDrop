import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";

//style
import classes from "styles/components/question.module.scss";
// types
import { DragItemType, RenderQuestionPropsTypes } from "types/componentType";
//translations
import { translations as persianTranslations } from "translations/persian";
import { translations as englishTranslations } from "translations/english";
import { QUESTIONS_TYPES } from "components/constants";

const RenderQuestion = ({
  question,
  id,
  handleDraggingQuestionAction,
  findQuestion,
  isSubQuestion,
}: RenderQuestionPropsTypes): JSX.Element => {
  const [language, setLanguage] = useState<string>("persian");
  const translations =
    language === "english" ? englishTranslations : persianTranslations;
  const originalIndex = findQuestion(id).index;
  const originalIndexInGroup = findQuestion(id).indexInGroup;
  const questionType = question.questionType;
  console.log("iss", isSubQuestion);
  const [{}, drag] = useDrag(
    () => ({
      type: questionType,
      item: { id, originalIndex, originalIndexInGroup, questionType },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex, originalIndexInGroup } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          console.log("end", item);
          !item.id
            ? console.log("end drop new")
            : handleDraggingQuestionAction({
                id: droppedId,
                atIndex: originalIndex,
                atIndexInGroup: originalIndexInGroup,
                action: "reOrder",
              });
        }
      },
    }),
    [
      id,
      originalIndex,
      originalIndexInGroup,
      handleDraggingQuestionAction,
      questionType,
    ]
  );

  const [{}, drop] = useDrop(
    () => ({
      drop(item: DragItemType) {
        !item.id &&
          handleDraggingQuestionAction({
            atIndex: originalIndex,
            atIndexInGroup: originalIndexInGroup,
            action: "afterPreViewAdd",
          });
      },
      accept: isSubQuestion
        ? QUESTIONS_TYPES.filter((questionType) => questionType != "group")
        : QUESTIONS_TYPES,
      hover(item) {
        const isNewQuestion = !item.id;
        const overIndex = findQuestion(id).index;
        const overIndexInGroup = findQuestion(id).indexInGroup;

        if (isNewQuestion) {
          if (!!question.id)
            handleDraggingQuestionAction({
              questionType: item.questionType,
              atIndex: overIndex,
              atIndexInGroup: overIndexInGroup,
              action: "addNewQuestionPreview",
            });
          return;
        }
        const draggedId = item.id;
        console.log("hoverItem", item);

        if (draggedId !== id) {
          handleDraggingQuestionAction({
            id: draggedId,
            atIndex: overIndex,
            atIndexInGroup: overIndexInGroup,
            action: "reOrder",
          });
        }
      },
    }),
    [
      id,
      originalIndex,
      originalIndexInGroup,
      handleDraggingQuestionAction,
      questionType,
    ]
  );
  return (
    <>
      <div
        className={`${classes.question_row}`}
        ref={(node) => drag(drop(node))}
      >
        {translations.questions[question.questionType].titleText}
        <p>{id}</p>
      </div>
    </>
  );
};

export default RenderQuestion;
