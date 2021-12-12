import React from "react";

export type RenderQuestionPropsTypes={
    question:{
        id:string;
        questionType:string
    };
    index:number;
}
export type RightNavbarPropsTypes={
    data:dragItemType;
    type:string
}
export type DropZonePropsTypes={
    addQuestionFunction?:(questionType:string) => void;
    children?: React.ReactNode;
    acceptType:string
}
export type welcomePageDetailsType= Array<{
  id:string,
}>
export type appreciationPageDetailsType= Array<{
    id:string,
}>
export type questionsDetailsType=Array<{
    id:string;
    questionType:string
}>
export type dragItemType={
    id:string;
    type:string;
    question?:{
        questionType:string;
        id:string;
    }
}
