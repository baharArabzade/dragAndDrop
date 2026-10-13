// types
import {
  BlockType,
  NormalQuestionType,
  QuestionType,
} from "types/componentType";

export const WELCOME_PAGE = "welcomePage";
export const THANK_YOU_PAGE = "thankYouPage";
export const GROUP_QUESTION = "group";

export const QUESTION_DROP_ZONE = "question";
export const GROUP_QUESTION_DROP_ZONE = "groupQuestion";

export const NORMAL_QUESTION_TYPES: NormalQuestionType[] = [
  "shortAnswer",
  "longAnswer",
  "multipleChoice",
  "number",
  "email",
];

export const QUESTION_TYPES: QuestionType[] = [
  "shortAnswer",
  "longAnswer",
  "multipleChoice",
  GROUP_QUESTION,
  "number",
  "email",
];

export const SIDEBAR_BLOCKS: BlockType[] = [
  WELCOME_PAGE,
  ...QUESTION_TYPES,
  THANK_YOU_PAGE,
];

export const DRAG_ACTIONS = {
  deletePreViewQuestion: "deletePreViewQuestion",
  afterPreViewAdd: "afterPreViewAdd",
  addNewQuestionPreview: "addNewQuestionPreview",
  addToEndOfGroupQuestion: "addToEndOfGroupQuestion",
  addToEndOfQuestions: "addToEndOfQuestions",
  reOrder: "reOrder",
} as const;
