import React, {useState} from 'react';
import {Draggable} from "react-beautiful-dnd";
//style
import classes from "styles/components/questionRow.module.scss";
// types
import {QuestionRowPropsTypes} from "types/componentType";
//translations
import {translations as persianTranslations} from "translations/persian";
import {translations as englishTranslations} from "translations/english";

const QuestionRow = ({question, index,}: QuestionRowPropsTypes): JSX.Element => {
    const [language,setLanguage] = useState<string>('persian')
    const translations = (language === 'english' ? englishTranslations : persianTranslations)
    return (
        <Draggable
            key={question.id}
            draggableId={question.id}
            index={index}>
            {(
                provided,
                snapshot
            ) => (
                <div
                    className={`${classes.question_row} ${snapshot.isDragging && classes.dragging_question}`}

                    ref={
                        provided.innerRef
                    }
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}

                >
                    {translations.questions[question.questionType].titleText }
                </div>
            )}
        </Draggable>

    );
};

export default QuestionRow;