import React, {useState} from "react";
import {Draggable, Droppable} from "react-beautiful-dnd";
//style
import classes from "styles/components/rightNavbar.module.scss";
//types
import {RightNavbarProps} from"types/componentType"
//translations
import {translations as persianTranslations} from "translations/persian";
import {translations as englishTranslations} from "translations/english";

export const defaultQuestions = [
    {
        id: 'multipleChoiceQuestion',
        questionType: 'longAnswer'
    },
    {
        id: 'number',
        questionType: 'number'
    },
    {
        id: 'shortAnswer',
        questionType: 'shortAnswer'
    },
];

const RightNavbar = ({isWelcomeDragDisable, isAppreciationDragDisable}: RightNavbarProps): JSX.Element => {
    const [language, setLanguage] = useState<string>('persian')
    const translations = (language === 'english' ? englishTranslations : persianTranslations)
    return (
        <>
            <Droppable droppableId="rightNavbar" isDropDisabled={true}>
                {(provided) => (
                    <div className={classes.questionsBox}
                         ref={provided.innerRef}
                    >
                        <Draggable
                            isDragDisabled={isWelcomeDragDisable}
                            key={'welcomePage'}
                            draggableId={'welcomePage'}
                            index={0}>
                            {(provided, snapshot) => (
                                <React.Fragment>
                                    <div
                                        className={`${classes.default_question} ${snapshot.isDragging && classes.dragging_item} ${isWelcomeDragDisable && classes.disable_drag}`}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        {translations.welcomePage.titleText}
                                    </div>
                                    {snapshot.isDragging && (
                                        <div
                                            className={`${classes.default_question}`}>{translations.welcomePage.titleText}</div>
                                    )}
                                </React.Fragment>
                            )}
                        </Draggable>
                        {defaultQuestions.map((question, index) => (
                            <Draggable
                                key={question.id}
                                draggableId={question.id}
                                index={index}>
                                {(provided, snapshot) => (
                                    <React.Fragment>
                                        <div
                                            className={`${classes.default_question} ${snapshot.isDragging && classes.dragging_item}`}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {translations.questions[question.questionType].titleText}
                                        </div>
                                        {snapshot.isDragging && (
                                            <div
                                                className={`${classes.default_question}`}>{translations.questions[question.questionType].titleText}</div>
                                        )}
                                    </React.Fragment>
                                )}
                            </Draggable>
                        ))}
                        <Draggable key={'appreciationPage'}
                                   isDragDisabled={isAppreciationDragDisable}
                                   draggableId={'appreciationPage'}
                                   index={0}>
                            {(provided, snapshot) => (
                                <React.Fragment>
                                    <div
                                        className={`${classes.default_question} ${snapshot.isDragging && classes.dragging_item} ${isAppreciationDragDisable && classes.disable_drag}`}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        {translations.appreciationPage.titleText}
                                    </div>
                                    {snapshot.isDragging && (
                                        <div
                                            className={`${classes.default_question}`}>{translations.appreciationPage.titleText}</div>
                                    )}
                                </React.Fragment>
                            )}


                        </Draggable>
                    </div>
                )}
            </Droppable>

        </>
    );
};

export default RightNavbar;
