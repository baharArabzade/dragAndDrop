import { useDrag, useDrop } from "react-dnd";
// style
import classes from "styles/components/question.module.scss";
// types
import { DragItemType, QuestionType, QuestionPropsTypes } from "types/question";
// translations
import { translations as englishTranslations } from "translations/english";
// constants
import { NORMAL_QUESTION_TYPES, QUESTION_TYPES } from "constants/formBuilder";

const Question = ({
  question,
  handleDraggingQuestionAction,
  findQuestion,
  isSubQuestion,
}: QuestionPropsTypes): JSX.Element => {
  const translations = englishTranslations;
  const { id, questionType } = question;
  const { index: originalIndex, indexInGroup: originalIndexInGroup } =
    findQuestion(id);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: questionType,
      item: { id, originalIndex, originalIndexInGroup, questionType },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        if (monitor.didDrop() || !item.id) {
          return;
        }

        handleDraggingQuestionAction({
          id: item.id,
          atIndex: item.originalIndex,
          atIndexInGroup: item.originalIndexInGroup,
          action: "moveQuestion",
        });
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
  const [, drop] = useDrop(
    () => ({
      drop(item: DragItemType<QuestionType>) {
        if (item.id) {
          return;
        }

        handleDraggingQuestionAction({
          action: "confirmPreview",
        });
      },
      accept: isSubQuestion ? NORMAL_QUESTION_TYPES : QUESTION_TYPES,
      hover(item: DragItemType<QuestionType>) {
        const { index: overIndex, indexInGroup: overIndexInGroup } =
          findQuestion(id);

        if (!item.id) {
          if (!id) {
            return;
          }

          handleDraggingQuestionAction({
            questionType: item.questionType,
            atIndex: overIndex,
            atIndexInGroup: overIndexInGroup,
            action: "addPreview",
          });
          return;
        }

        if (item.id === id) {
          return;
        }

        handleDraggingQuestionAction({
          id: item.id,
          atIndex: overIndex,
          atIndexInGroup: overIndexInGroup,
          action: "moveQuestion",
        });
      },
    }),
    [id, isSubQuestion, findQuestion, handleDraggingQuestionAction]
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

export default Question;
