import React, {useState} from "react";
import {Draggable, Droppable} from "react-beautiful-dnd";
import uuid from "uuid/v4";
//style
import styles from "styles/components/sampleQuestionsColumn.module.scss";

export const sampleQuestions = [
    {

        id: uuid(),
        content: 'صفحه خوش آمد گویی',
        type: 'welcome'

    },
    {
        id: uuid(),
        content: 'چند گزینه ای',
        type: 'exam'
    },
    {
        id: uuid(),
        content: 'طیفی',
        type: 'exam'
    },
    {
        id: uuid(),
        content: 'عدد',
        type: 'exam'
    },
    {
        id: 'appreciation',
        content: 'صفجه تشکر',
        type: 'appreciation'

    }
];


type SampleQuestionColumnProps={
    isWelcomeDragDisable:boolean;
    isAppreciationDragDisable:boolean;
}
const SampleQuestionsColumn = ({isWelcomeDragDisable,isAppreciationDragDisable}:SampleQuestionColumnProps):JSX.Element => {
    return (
        <Droppable droppableId="questionsBox" isDropDisabled={true}>
            {(provided) => (
                <div className={styles.questionsBox}
                     ref={provided.innerRef}
                >
                    {sampleQuestions.map((item, index) => (
                        <Draggable

                            isDragDisabled={(item.type === 'appreciation' && isAppreciationDragDisable) ||(item.type === 'welcome' && isWelcomeDragDisable)}
                            key={item.id}
                            draggableId={item.id}
                            index={index}>
                            {(provided, snapshot) => (
                                <React.Fragment>
                                    <div
                                        className={`${styles.item_Basic} ${snapshot.isDragging && styles.dragging_item } ${ (item.type ==='appreciation' || item.type === 'welcome') && styles.apply_width} 
                                         ${((item.type === 'appreciation' && isAppreciationDragDisable) || (item.type === 'welcome' && isWelcomeDragDisable))&&styles.disable_drag}
                                        `}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >

                                        {item.content}
                                    </div>
                                    {snapshot.isDragging && (
                                        <div  className={`${styles.item_Basic}  ${ (item.type ==='appreciation' || item.type === 'welcome') && styles.apply_width} `} >{item.content}</div>
                                    )}
                                </React.Fragment>
                            )}
                        </Draggable>
                    ))}
                </div>
            )}
        </Droppable>
    );
};

export default SampleQuestionsColumn;
