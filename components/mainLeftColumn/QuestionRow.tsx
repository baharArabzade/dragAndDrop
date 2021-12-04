import React from 'react';
import {Draggable} from "react-beautiful-dnd";
//style
import classes from "styles/components/questionRow.module.scss";
// types
import {QuestionRowPropsTypes} from "types/componentType";
//translations
import {translations as persianTranslations} from "translations/persian";
import {translations as englishTranslations} from "translations/english";

const QuestionRow = ({item, index,isDragDisabled}:QuestionRowPropsTypes):JSX.Element => {
    const language = 'english'
    const translations = (language === 'english'?englishTranslations:persianTranslations)
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
                    className={`${classes.question_row} ${snapshot.isDragging&&classes.dragging_question}`}

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