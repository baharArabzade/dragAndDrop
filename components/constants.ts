import uuid from "uuid";

export const QUESTION_TYPE = <string>"question";
export const APPRECIATION_TYPE = <string>"appreciationPage";
export const WELCOME_TYPE = <string>"welcomePage";
export const GROUP_QUESTION_TYPE = <string>"groupQuestion"
export const RIGHT_NAVBAR_ITEMS = [

    {
        id: uuid(),
        type: WELCOME_TYPE
    },
    {
        id: uuid(),
        type: QUESTION_TYPE,
        question: {
            questionType: "number",
            id: uuid()
        }
    },
    {
        id: uuid(),
        type: GROUP_QUESTION_TYPE,
        question: {
            questionType: 'group',
            id: uuid(),
        }
    },
    {
        id: uuid(),
        type: QUESTION_TYPE,
        question: {
            questionType: "longAnswer",
            id: uuid()
        }
    },
    {
        id: uuid(),
        type: QUESTION_TYPE,
        question: {
            questionType: "shortAnswer",
            id: uuid()
        }
    },
    {
        id: uuid(),
        type: APPRECIATION_TYPE
    },

];
