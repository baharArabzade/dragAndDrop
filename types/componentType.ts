import React from "react";

export type RenderQuestionPropsTypes = {
    question: {
        id: string;
        questionType?: string
        subQuestions?: Array<{
            id: string;
            questionType: string;
        }>
    }
    index?: number;
}
export type RightNavbarPropsTypes = {
    data: dragItemType;
    type: string
}
export type DropZonePropsTypes = {
    addQuestionFunction?: (questionType: string) => void;
    children?: React.ReactNode;
    acceptType: Array<string> | string
    addAppreciationPage?: (appreciationPageId: string) => void,
    addWelcomePage?: (welcomePageId: string) => void,
    addSubQuestionToGroupQuestion?: (subQuestion: { id: string, questionType: string }, groupQuestionId: string) => void
    type: string
    className: string
    groupQuestionId?: string

}
export type welcomePageDetailsType = Array<{
    id: string,
    questionType: string
}>
export type appreciationPageDetailsType = Array<{
    id: string,
    questionType: string
}>
export type questionsDetailsType = Array<{
    id: string;
    questionType: string
    subQuestions?: Array<{
        id: string;
        questionType: string;
    }>
}>
export type dragItemType = {
    id: string;
    type: string;
    question?: {
        questionType: string;
        id: string;
    }
}
