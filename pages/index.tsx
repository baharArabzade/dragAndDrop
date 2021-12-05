import React, {useEffect, useState} from 'react';
import uuid from 'uuid/v4';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import Toggle from 'react-toggle'
import RightNavbar, {defaultQuestions} from "@components/mainRightColumn/RightNavbar"
import QuestionRow from "components/mainLeftColumn/QuestionRow";
//style
import classes from "styles/index.module.scss"
//types
import {
    appreciationPageDetailsType,
    droppableItemInfoType,
    listOfItemsType,
    questionsDetailsType,
    welcomePageDetailsType
} from "types/componentType";
//translations
import {translations as persianTranslations} from "translations/persian";
import {translations as englishTranslations, translations as englishTranslators} from "translations/english";

const BuildPage = (): JSX.Element => {
    const [language, setLanguage] = useState<string>('persian')
    const [appreciationPageDetails, setAppreciationPageDetails] = useState<appreciationPageDetailsType>([])
    const [questionsDetails, setQuestionsDetails] = useState<questionsDetailsType>([])
    const [welcomePageDetails, setWelcomePageDetails] = useState<welcomePageDetailsType>([])

    const [draggedItemType, setDraggedItemType] = useState<string>('')
    const translations = (language === 'english' ? englishTranslations : persianTranslations)

    const reorderQuestions = (startIndex: number, endIndex: number): void => {
        const [removed] = questionsDetails.splice(startIndex, 1);
        let newQuestions = questionsDetails
        newQuestions.splice(endIndex, 0, removed);
        setQuestionsDetails(newQuestions)

    };

    const addQuestion = (questionType: string, destinationIndex: number) => {
        let newQuestions = questionsDetails
        newQuestions.splice(destinationIndex, 0, {questionType, id: uuid()})
        setQuestionsDetails(newQuestions)
    };
    const addWelcomePage = () => {
        setWelcomePageDetails([{id: uuid()}])
    }
    const addAppreciationPage = () => {
        setAppreciationPageDetails([{id: uuid()}])
    }

    const onDragStart = (startDragActionDetails) => {
        console.log('resualt', startDragActionDetails)
        const {droppableId} = startDragActionDetails.source
        if (droppableId === 'rightNavbar') {
            switch (startDragActionDetails.draggableId) {
                case 'welcomePage':
                    setDraggedItemType('welcomePage')
                    break
                case 'appreciationPage':
                    setDraggedItemType('appreciationPage')
                    break
                default:
                    setDraggedItemType('question')
                    break
            }
        }
        if (droppableId === 'questionHolder') {
            setDraggedItemType('question')
        }

    }
    useEffect(() => {
        console.log('type', draggedItemType)
    }, [draggedItemType])
    const onDragEnd = (dragActionDetails) => {

        const {source, destination, draggableId} = dragActionDetails;
        console.log('action', dragActionDetails)
        if (!destination) {
            return;
        }

        if (source.droppableId === 'rightNavbar') {
            switch (draggableId) {
                case 'welcomePage':
                    if (destination.droppableId === 'welcomePageHolder') {
                        addWelcomePage()
                    }

                    break;
                case 'appreciationPage':
                    destination.droppableId === 'appreciationPageHolder' && addAppreciationPage()
                    break;
                default: //for questions
                    destination.droppableId === 'questionsHolder' && addQuestion(
                        defaultQuestions[source.index].questionType,
                        destination.index
                    )
                    break;

            }
        } else if (source.droppableId === 'questionsHolder') {
            console.log('*****************')
            reorderQuestions(
                source.index,
                destination.index
            )
        }


    };
    useEffect(() => {
        console.log(language)
    }, [language])
    return (
        <>
            <Toggle
                id='englishLanguage'
                defaultChecked={false}
                onChange={() => setLanguage((language) => language === 'english' ? 'persian' : 'english')}
            />
            <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                <RightNavbar isAppreciationDragDisable={appreciationPageDetails.length ? true : false}
                             isWelcomeDragDisable={welcomePageDetails.length ? true : false}/>
                <div className={classes.form_container}>
                    <Droppable key={'welcomePageHolder'} droppableId={'welcomePageHolder'}
                               isDropDisabled={(draggedItemType !== 'welcomePage') || welcomePageDetails.length}>
                        {(provided) => (
                            <div className={classes.list}
                                 ref={provided.innerRef}
                            >
                                {welcomePageDetails.length ?
                                    <div className={classes.welcome_page_row}>
                                        {translations.welcomePage.titleText}
                                    </div> : ''
                                }
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <Droppable key={'questionsHolder'} droppableId={'questionsHolder'}
                               isDropDisabled={draggedItemType !== 'question'}>
                        {(provided) => (
                            <div className={classes.questions_holder}
                                 ref={provided.innerRef}
                            >
                                {questionsDetails.length ? questionsDetails.map((question, index) => (
                                    <QuestionRow question={question} index={index}/>
                                )) : ''}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <Droppable key={'appreciationPageHolder'} droppableId={'appreciationPageHolder'}
                               isDropDisabled={draggedItemType !== 'appreciationPage' || appreciationPageDetails.length}>
                        {(provided) => (
                            <div className={classes.list}
                                 ref={provided.innerRef}
                            >
                                {appreciationPageDetails.length ?
                                    <div className={classes.welcome_page_row}>
                                        {translations.appreciationPage.titleText}
                                    </div> : ''}
                                {provided.placeholder}

                            </div>

                        )}
                    </Droppable>
                </div>
            </DragDropContext>
        </>
    );

}


export default BuildPage