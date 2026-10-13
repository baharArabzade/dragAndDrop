import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
// constants
import {
  BLOCK_ICONS,
  DRAG_ACTIONS,
  THANK_YOU_PAGE,
  WELCOME_PAGE,
} from "components/constants";
// style
import classes from "styles/components/sidebar.module.scss";
// types
import { SidebarItemPropsTypes } from "types/componentType";
// translations
import { translations as englishTranslations } from "translations/english";

const SidebarItem = ({
  questionType,
  handleDraggingQuestionAction,
}: SidebarItemPropsTypes): JSX.Element => {
  const [inValidDrop, setInValidDrop] = useState<boolean>(false);
  const translations = englishTranslations;
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
    handleDraggingQuestionAction({
      action: DRAG_ACTIONS.deletePreViewQuestion,
    });
    setInValidDrop(false);
  }, [inValidDrop]);

  const isPage =
    questionType === WELCOME_PAGE || questionType === THANK_YOU_PAGE;
  const itemClassName = [
    classes.default_question,
    isPage ? classes.full_width : "",
    isDragging ? classes.isDragging : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div role="button" className={itemClassName} ref={drag}>
      <span className={`${classes.icon} ${classes[questionType]}`}>
        {BLOCK_ICONS[questionType]}
      </span>
      {translations.questions[questionType].titleText}
    </div>
  );
};
export default SidebarItem;
