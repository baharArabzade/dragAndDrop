import uuid from "uuid";

export const QUESTION_TYPE = <string>"questions";
export const APPRECIATION_TYPE = <string>"appreciationPage";
export const WELCOME_TYPE = <string>"welcomePage";
export const GROUP_QUESTION_TYPE = <string>"groupQuestion";
export const RIGHT_NAVBAR_QUESTION = <string>"rightNavbarQuestion";
export const QUESTIONS_TYPES = ["number", "group", "longAnswer", "shortAnswer"];
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
