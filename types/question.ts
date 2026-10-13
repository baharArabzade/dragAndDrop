import { ReactNode } from "react";
// constants
import { DRAG_ACTIONS } from "constants/formBuilder";

export type NormalQuestionType =
  | "number"
  | "longAnswer"
  | "shortAnswer"
  | "multipleChoice"
  | "email";
export type QuestionType = NormalQuestionType | "group";
export type PageType = "welcomePage" | "thankYouPage";
export type BlockType = QuestionType | PageType;
export type DropZoneType = PageType | "question" | "groupQuestion";
export type BaseQuestionDetailsType = {
  id?: string;
};

export type NormalQuestionDetailsType = BaseQuestionDetailsType & {
  questionType: NormalQuestionType;
};

export type GroupQuestionDetailsType = BaseQuestionDetailsType & {
  questionType: "group";
  subQuestions: NormalQuestionDetailsType[];
};

export type QuestionDetailsType =
  | NormalQuestionDetailsType
  | GroupQuestionDetailsType;

export type PageDetailsType = {
  id: string;
  questionType: PageType;
};

export type QuestionLocationType = {
  index: number;
  indexInGroup: number;
  question?: QuestionDetailsType;
};

export type DragActionType =
  | { action: typeof DRAG_ACTIONS.removePreview }
  | {
      action: typeof DRAG_ACTIONS.confirmPreview;
      atIndex: number;
      atIndexInGroup: number;
    }
  | {
      action: typeof DRAG_ACTIONS.addPreview;
      questionType: QuestionType;
      atIndex: number;
      atIndexInGroup: number;
    }
  | {
      action: typeof DRAG_ACTIONS.moveToEndOfGroup;
      id: string;
      atIndex: number;
    }
  | { action: typeof DRAG_ACTIONS.moveToEnd; id: string }
  | {
      action: typeof DRAG_ACTIONS.moveQuestion;
      id: string;
      atIndex: number;
      atIndexInGroup: number;
    };

export type HandleDraggingQuestionActionType = (
  dragAction: DragActionType
) => void;

export type DragItemType<T extends BlockType = BlockType> = {
  id?: string;
  originalIndex?: number;
  originalIndexInGroup?: number;
  questionType: T;
};

export type QuestionPropsTypes = {
  question: QuestionDetailsType;
  isSubQuestion: boolean;
  handleDraggingQuestionAction: HandleDraggingQuestionActionType;
  findQuestion: (id: string | undefined) => QuestionLocationType;
};

export type SidebarItemPropsTypes = {
  questionType: BlockType;
  handleDraggingQuestionAction: HandleDraggingQuestionActionType;
};

export type DropZonePropsTypes<T extends BlockType> = {
  acceptType: T | T[];
  dropZoneType: DropZoneType;
  onAddItem: (questionType: T) => void;
  handleDraggingQuestionAction?: HandleDraggingQuestionActionType;
  index?: number;
  children?: ReactNode;
};
