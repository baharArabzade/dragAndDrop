export type QuestionRowPropsTypes={
    question:{
        id:string;
        questionType:string
    };
    index:number;
}
export type welcomePageDetailsType= Array<{
  id:string,
}>
export type appreciationPageDetailsType= Array<{
    id:string,
}>
export type listOfItemsType = Array<{
    id: string, type: string
    content:string
}>
export type questionsDetailsType=Array<{
    id:string;
    questionType:string
}>
export type droppableItemInfoType={
    index: number,
    droppableId: string
}
export type RightNavbarProps = {
    isWelcomeDragDisable: boolean;
    isAppreciationDragDisable: boolean;
}