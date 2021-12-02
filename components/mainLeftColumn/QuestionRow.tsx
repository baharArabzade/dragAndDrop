import React from 'react';
import {Draggable} from "react-beautiful-dnd";
//style
import styles from "styles/components/questionRow.module.scss";
// types
import {QuestionRowProps} from "types/componentType";


const QuestionRow = ({item, index,isDragDisabled}:QuestionRowProps):JSX.Element => {
    return (
        <Draggable
            isDragDisabled={isDragDisabled}
            key={item.id}
            draggableId={item.id}
            index={index}>
            {(
                provided,
                snapshot
            ) => (
                <div
                    className={`${styles.question_row} ${snapshot.isDragging&&styles.dragging_question}`}

                    ref={
                        provided.innerRef
                    }
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}

                >
                    {item.content}
                </div>
            )}
        </Draggable>

    );
};

export default QuestionRow;