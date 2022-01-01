export const QUESTION_TYPE = <string>"questions";
export const APPRECIATION_TYPE = <string>"appreciationPage";
export const WELCOME_TYPE = <string>"welcomePage";
export const GROUP_QUESTION_TYPE = <string>"groupQuestion";
export const QUESTIONS_TYPES = ["number", "group", "longAnswer", "shortAnswer"];
export const actions = {
  deletePreViewQuestion: "deletePreViewQuestion",
  afterPreViewAdd: "afterPreViewAdd",
  addNewQuestionPreview: "addNewQuestionPreview",
  addToEndOfGroupQuestion: "addToEndOfGroupQuestion",
  addToEndOfQuestions: "addToEndOfQuestions",
  reOrder: "reOrder",
};
export const RIGHT_NAVBAR_ITEMS = [
  {
    questionType: "welcomePage",
  },
  {
    questionType: "number",
  },
  {
    questionType: "group",
  },
  {
    questionType: "longAnswer",
  },
  {
    questionType: "shortAnswer",
  },
  {
    questionType: "appreciationPage",
  },
];
