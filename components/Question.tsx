import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
//style
import classes from "styles/components/question.module.scss";
// types
import { DragItemType, RenderQuestionPropsTypes } from "types/componentType";
//translations
import { translations as persianTranslations } from "translations/persian";
//constants
import { QUESTIONS_TYPES } from "components/constants";
import { actions } from "components/constants";

const RenderQuestion = ({
  question,
  id,
  handleDraggingQuestionAction,
  findQuestion,
  isSubQuestion,
}: RenderQuestionPropsTypes): JSX.Element => {
  const translations = persianTranslations;
  const originalIndex = findQuestion(id).index;
  const originalIndexInGroup = findQuestion(id).indexInGroup;
  const questionType = question.questionType;
  const [inValidDrop, setInvalidDrop] = useState<boolean>(false);
  const [revertActionData, setRevertActionData] = useState<{
    id: string;
    originalIndex: number;
    originalIndexInGroup: number;
  }>(null);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: questionType,
      item: { id, originalIndex, originalIndexInGroup, questionType },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        inValidDrop: monitor.getDropResult(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex, originalIndexInGroup } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          if (!!item.id) {
            setRevertActionData({
              id: droppedId,
              originalIndex,
              originalIndexInGroup,
            });
            setInvalidDrop(true);
          }
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
  useEffect(() => {
    if (inValidDrop) {
      handleDraggingQuestionAction({
        id: revertActionData.id,
        atIndex: revertActionData.originalIndex,
        atIndexInGroup: revertActionData.originalIndexInGroup,
        action: actions.reOrder,
      });
      setInvalidDrop(false);
    }
  }, [inValidDrop]);
  const [{}, drop] = useDrop(
    () => ({
      drop(item: DragItemType) {
        !item.id &&
          handleDraggingQuestionAction({
            atIndex: originalIndex,
            atIndexInGroup: originalIndexInGroup,
            action: actions.afterPreViewAdd,
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
              action: actions.addNewQuestionPreview,
            });
          return;
        }
        const draggedId = item.id;
        if (draggedId !== id) {
          handleDraggingQuestionAction({
            id: draggedId,
            atIndex: overIndex,
            atIndexInGroup: overIndexInGroup,
            action: actions.reOrder,
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
        {!isDragging && (
          <>
            {translations.questions[question.questionType].titleText}
            <p>{question.id}</p>
          </>
        )}
      </div>
    </>
  );
};

export default RenderQuestion;
