import { useState } from "react";
import { useDrop } from "react-dnd";
import uuid from "uuid/v4";
//style
import classes from "styles/index.module.scss";
//types
import { DragItemType, DropZonePropsTypes } from "types/componentType";
//translations
import { translations as englishTranslations } from "translations/english";
import { translations as persianTranslations } from "translations/persian";

const DropZone = ({
  addItemFunction,
  children,
  acceptType,
  dropZoneType,
  findQuestion,
  handleDraggingQuestionAction,
  index,
  groupQuestionId,
}: DropZonePropsTypes): JSX.Element => {
  const [language, setLanguage] = useState("persian");
  const translations =
    language === "english" ? englishTranslations : persianTranslations;
  const [{ isOverCurrent }, drop] = useDrop(
    () => ({
      accept: acceptType,
      drop(item: DragItemType, monitor) {
        let isNewQuestion = !item.id; // dragged Item from rightNavbar does not have id
        const dropOnChild = monitor.didDrop();
        if (dropOnChild) {
          return;
        }
        switch (dropZoneType) {
          case "welcomePage":
            addItemFunction(uuid());
            break;

          case "appreciationPage":
            addItemFunction(uuid());
            break;

          case "groupQuestion":
            isNewQuestion
              ? addItemFunction(item.questionType, groupQuestionId)
              : handleDraggingQuestionAction({
                  id: item.id,
                  atIndex: index,
                  action: "addToEndOfGroupQuestion",
                });
            break;

          case "questions":
            isNewQuestion
              ? addItemFunction(item.questionType)
              : handleDraggingQuestionAction({
                  id: item.id,
                  action: "addToEndOfQuestions",
                });
            break;
        }
      },
      collect: (monitor) => ({
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [findQuestion, handleDraggingQuestionAction]
  );

  return (
    <div ref={drop}>
      <div
        className={`${
          dropZoneType === "groupQuestion" && classes.group_question_drop_zone
        }`}
      >
        {children}
        <div
          className={
            isOverCurrent ? classes.place_holder_isOver : classes.place_holder
          }
        >
          {translations.placeHolder[dropZoneType].titleText}
        </div>
      </div>
    </div>
  );
};
export default DropZone;
