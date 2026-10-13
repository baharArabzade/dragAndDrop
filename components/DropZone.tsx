import { useDrop } from "react-dnd";
// constants
import {
  GROUP_QUESTION_DROP_ZONE,
  QUESTION_DROP_ZONE,
} from "constants/formBuilder";
// style
import classes from "styles/components/dropZone.module.scss";
// types
import { BlockType, DragItemType, DropZonePropsTypes } from "types/question";
// translations
import { translations as englishTranslations } from "translations/english";

const DropZone = <T extends BlockType>({
  onAddItem,
  children,
  acceptType,
  dropZoneType,
  handleDraggingQuestionAction,
  index,
}: DropZonePropsTypes<T>): JSX.Element => {
  const translations = englishTranslations;
  const [{ isOverCurrent }, drop] = useDrop(
    () => ({
      accept: acceptType,
      drop(item: DragItemType<T>, monitor) {
        if (monitor.didDrop()) {
          return;
        }

        // items dragged from the sidebar do not have an id yet
        if (!item.id) {
          onAddItem(item.questionType);
          handleDraggingQuestionAction?.({
            action: "removePreview",
          });
          return;
        }

        if (dropZoneType === GROUP_QUESTION_DROP_ZONE && index !== undefined) {
          handleDraggingQuestionAction?.({
            id: item.id,
            atIndex: index,
            action: "moveToEndOfGroup",
          });
          return;
        }

        if (dropZoneType === QUESTION_DROP_ZONE) {
          handleDraggingQuestionAction?.({
            id: item.id,
            action: "moveToEnd",
          });
        }
      },
      collect: (monitor) => ({
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [acceptType, onAddItem, dropZoneType, handleDraggingQuestionAction, index]
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
            isOverCurrent ? classes.place_holder_over : classes.place_holder
          }
        >
          {translations.placeHolder[dropZoneType].titleText}
        </div>
      </div>
    </div>
  );
};

export default DropZone;
