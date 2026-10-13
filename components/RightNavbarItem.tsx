import React, { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
//style
import classes from "styles/components/rightNavbar.module.scss";
//types
import { RightNavbarPropsTypes } from "types/componentType";
//translations
import { translations as persianTranslations } from "translations/persian";

const RightNavbarItem = ({
  questionType,
  handleDraggingQuestionAction,
}: RightNavbarPropsTypes): JSX.Element => {
  const [inValidDrop, setInValidDrop] = useState<boolean>(false);
  const translations = persianTranslations;
  const [{ isDragging }, drag] = useDrag(
    {
      type: questionType,
      item: { questionType },
      end: (item, monitor) => {
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          setInValidDrop(true);
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        inValidDrop: monitor.getDropResult(),
      }),
    },
    [handleDraggingQuestionAction, questionType]
  );
  useEffect(() => {
    handleDraggingQuestionAction({ action: "deletePreViewQuestion" });
    setInValidDrop(false);
  }, [inValidDrop]);
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
