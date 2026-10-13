import { useDrop } from "react-dnd";
// constants
import {
  DRAG_ACTIONS,
  GROUP_QUESTION_DROP_ZONE,
  QUESTION_DROP_ZONE,
} from "components/constants";
// style
import classes from "styles/index.module.scss";
// types
import {
  BlockType,
  DragItemType,
  DropZonePropsTypes,
} from "types/componentType";
// translations
import { translations as persianTranslations } from "translations/persian";

const DropZone = <T extends BlockType>({
  addItemFunction,
  children,
  acceptType,
  dropZoneType,
  handleDraggingQuestionAction,
  index,
}: DropZonePropsTypes<T>): JSX.Element => {
  const translations = persianTranslations;
  const [{ isOverCurrent }, drop] = useDrop(
    () => ({
      accept: acceptType,
      drop(item: DragItemType<T>, monitor) {
        if (monitor.didDrop()) {
          return;
        }

        const isNewItem = !item.id; // items dragged from the sidebar do not have an id yet

        if (isNewItem) {
          addItemFunction(item.questionType);
          handleDraggingQuestionAction?.({
            action: DRAG_ACTIONS.deletePreViewQuestion,
          });
          return;
        }

        if (dropZoneType === GROUP_QUESTION_DROP_ZONE) {
          handleDraggingQuestionAction?.({
            id: item.id,
            atIndex: index,
            action: DRAG_ACTIONS.addToEndOfGroupQuestion,
          });
          return;
        }

        if (dropZoneType === QUESTION_DROP_ZONE) {
          handleDraggingQuestionAction?.({
            id: item.id,
            action: DRAG_ACTIONS.addToEndOfQuestions,
          });
        }
      },
      collect: (monitor) => ({
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [
      acceptType,
      addItemFunction,
      dropZoneType,
      handleDraggingQuestionAction,
      index,
    ]
  );

  return (
    <div ref={drop}>
      <div
        className={
          dropZoneType === GROUP_QUESTION_DROP_ZONE
            ? classes.group_question_drop_zone
            : undefined
        }
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
