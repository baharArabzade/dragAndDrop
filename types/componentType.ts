export type QuestionRowPropsTypes={
    item:{
        id:string;
        content:string;
    };
    index:number;
    isDragDisabled:boolean;
}
export type listOfItemsType = Array<{
    id: string, content: string, type: string
}>

export type droppableItemInfoType={
    index: number,
    droppableId: string

}