import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
// style
import classes from "styles/components/question.module.scss";
// types
import {
  DragItemType,
  QuestionType,
  RenderQuestionPropsTypes,
} from "types/componentType";
// translations
import { translations as englishTranslations } from "translations/english";
// constants
import {
  DRAG_ACTIONS,
  NORMAL_QUESTION_TYPES,
  QUESTION_TYPES,
} from "components/constants";

const RenderQuestion = ({
  question,
  handleDraggingQuestionAction,
  findQuestion,
  isSubQuestion,
}: RenderQuestionPropsTypes): JSX.Element => {
  const translations = englishTranslations;
  const { id, questionType } = question;
  const originalIndex = findQuestion(id).index;
  const originalIndexInGroup = findQuestion(id).indexInGroup;
  const [inValidDrop, setInvalidDrop] = useState<boolean>(false);
  const [revertActionData, setRevertActionData] = useState<{
    id: string;
    originalIndex: number;
    originalIndexInGroup: number;
  } | null>(null);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: questionType,
      item: { id, originalIndex, originalIndexInGroup, questionType },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        inValidDrop: monitor.getDropResult(),
      }),
      end: (item, monitor) => {
        if (monitor.didDrop() || !item.id) {
          return;
        }

        setRevertActionData({
          id: item.id,
          originalIndex: item.originalIndex,
          originalIndexInGroup: item.originalIndexInGroup,
        });
        setInvalidDrop(true);
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
    if (inValidDrop && revertActionData) {
      handleDraggingQuestionAction({
        id: revertActionData.id,
        atIndex: revertActionData.originalIndex,
        atIndexInGroup: revertActionData.originalIndexInGroup,
        action: DRAG_ACTIONS.reOrder,
      });
      setInvalidDrop(false);
    }
  }, [inValidDrop]);
  const [, drop] = useDrop(
    () => ({
      drop(item: DragItemType<QuestionType>) {
        !item.id &&
          handleDraggingQuestionAction({
            atIndex: originalIndex,
            atIndexInGroup: originalIndexInGroup,
            action: DRAG_ACTIONS.afterPreViewAdd,
          });
      },
      accept: isSubQuestion ? NORMAL_QUESTION_TYPES : QUESTION_TYPES,
      hover(item: DragItemType<QuestionType>) {
        const { index: overIndex, indexInGroup: overIndexInGroup } =
          findQuestion(id);

        if (!item.id) {
          if (question.id)
            handleDraggingQuestionAction({
              questionType: item.questionType,
              atIndex: overIndex,
              atIndexInGroup: overIndexInGroup,
              action: DRAG_ACTIONS.addNewQuestionPreview,
            });
          return;
        }
        if (item.id !== id) {
          handleDraggingQuestionAction({
            id: item.id,
            atIndex: overIndex,
            atIndexInGroup: overIndexInGroup,
            action: DRAG_ACTIONS.reOrder,
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

  const questionClassName = [
    classes.question_row,
    isSubQuestion ? classes.sub_question : "",
    isDragging ? classes.dragging_question : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role="button"
      className={questionClassName}
      ref={(node) => drag(drop(node))}
    >
      {!isDragging && (
        <>
          <span className={classes.drag_handle} />
          <div className={classes.question_content}>
            <span className={classes.question_title}>
              {translations.questions[questionType].titleText}
            </span>
            {isSubQuestion && (
              <span className={classes.question_badge}>
                {translations.placeHolder.groupQuestion.titleText}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RenderQuestion;
