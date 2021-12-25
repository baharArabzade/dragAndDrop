import React from "react";

export type RenderQuestionPropsTypes = {
  id?: string;
  handleDraggingQuestionAction?: ({
    id,
    questionType,
    atIndex,
    atIndexInGroup,
    action,
  }: HandleDraggingQuestionActionInputTypes) => void;
  findQuestion;
  isSubQuestion?: boolean;
  question: {
    id?: string;
    questionType?: string;
    subQuestions?: Array<{
      id?: string;
      questionType: string;
    }>;
  };

  index?: number;
};
export type RightNavbarPropsTypes = {
  handleDraggingQuestionAction?: ({
    action,
  }: HandleDraggingQuestionActionInputTypes) => void;
  questionType: string;
};
export type DropZonePropsTypes = {
  addItemFunction: (p1: string, p2?: string) => void;
  dropZoneType: string;
  findQuestion?: (id: string) => {
    index: number;
    indexInGroup?: number;
    question?: QuestionType;
  };
  handleDraggingQuestionAction?: ({
    id,
    questionType,
    atIndex,
    atIndexInGroup,
    action,
  }: HandleDraggingQuestionActionInputTypes) => void;

  index?: number;
  children?: React.ReactNode;
  acceptType: Array<string> | string;
  groupQuestionId?: string;
};
export type WelcomePageDetailsType = {
  id: string;
  questionType: string;
};
export type AppreciationPageDetailsType = {
  id: string;
  questionType: string;
};
export type QuestionType = {
  id?: string;
  questionType: string;
  subQuestions?: Array<{
    id?: string;
    questionType: string;
  }>;
};

export type HandleDraggingQuestionActionInputTypes = {
  id?: string;
  questionType?: string;
  atIndex?: number;
  atIndexInGroup?: number;
  action: string;
};
export type DragItemType = {
  id?: string;
  originalIndex: number;
  originalIndexInGroup: number;
  questionType: string;
};
