import React, { useState } from "react";
import { useDrag } from "react-dnd";
//style
import classes from "styles/components/rightNavbar.module.scss";
//types
import { RightNavbarPropsTypes } from "types/componentType";
//translations
import { translations as englishTranslations } from "translations/english";
import { translations as persianTranslations } from "translations/persian";

const RightNavbarItem = ({
  questionType,
  handleDraggingQuestionAction,
}: RightNavbarPropsTypes): JSX.Element => {
  const [language, setLanguage] = useState("persian");
  const translations =
    language === "english" ? englishTranslations : persianTranslations;
  const [{ isDragging }, drag] = useDrag(
    {
      type: questionType,
      item: { questionType },
      end: (item, monitor) => {
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          handleDraggingQuestionAction({ action: "deletePreViewQuestion" });
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    },
    [handleDraggingQuestionAction, questionType]
  );
  return (
    <div
      className={`${classes.default_question} ${
        isDragging && classes.isDragging
      }`}
      ref={drag}
      key={questionType}
    >
      {translations.questions[questionType].titleText}
    </div>
  );
};
export default RightNavbarItem;
