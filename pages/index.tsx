import React, {useState} from "react";
import {HTML5Backend as backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import uuid from "uuid/v4";
//constant
import {
    RIGHT_NAVBAR_ITEMS,
    QUESTION_TYPE, APPRECIATION_TYPE, WELCOME_TYPE, GROUP_QUESTION_TYPE
} from "components/constants";
// components
import RenderQuestion from "components/Question";
import DropZone from "components/DropZone";
import RightNavbarItem from "components/RightNavbarItem";
//style
import classes from "styles/index.module.scss"
//types
import {
    appreciationPageDetailsType, questionDetailType,
    questionsDetailsType, welcomePageDetailsType,
} from "types/componentType";

const BuildPage = (): JSX.Element => {
    const [questionsDetails, setQuestionsDetails] = useState<questionsDetailsType>([])
    const [welcomePage, setWelcomePage] = useState<welcomePageDetailsType>([])
    const [appreciationPage, setAppreciationPage] = useState<appreciationPageDetailsType>([])
    const addQuestion = (questionType: string): void => {
        let newQuestion: questionDetailType = {questionType, id: uuid()}
        if (questionType === 'group')
            newQuestion.subQuestions = []
        setQuestionsDetails((prevQuestions): questionsDetailsType => [...prevQuestions, newQuestion])
    };
    const addSubQuestionToGroupQuestion = (subQuestion, groupQuestionId) => {
        let index = questionsDetails.findIndex(question => question.id === groupQuestionId)
        setQuestionsDetails((prevQuestions) => {
                let updatedQuestion = prevQuestions[index]
                updatedQuestion.subQuestions.push(subQuestion)
                return prevQuestions.map((question) => question.id === groupQuestionId ? updatedQuestion : question)
            }
        )
    }
    const addWelcomePage = (welcomePageId: string): void => {
        setWelcomePage([{id: welcomePageId, questionType: WELCOME_TYPE}])

    }
    const addAppreciationPage = (appreciationPageId: string): void => {
        setAppreciationPage([{id: appreciationPageId, questionType: APPRECIATION_TYPE}])
    }
    return (
        <DndProvider backend={backend}>
            <div>
                <div className={classes.right_Navbar}>
                    {RIGHT_NAVBAR_ITEMS.map((item) => (
                        <RightNavbarItem data={item} type={item.type}/>
                    ))}
                </div>
                <div className={classes.form_container}>
                    {welcomePage.length ? <RenderQuestion question={welcomePage[0]} index={0}/> :
                        <DropZone acceptType={WELCOME_TYPE} type={WELCOME_TYPE}
                                  addWelcomePage={(welcomePageId) => addWelcomePage(welcomePageId)}
                                  className={'default'}/>}

                    <DropZone addQuestionFunction={(questionType => addQuestion(questionType))}
                              acceptType={[QUESTION_TYPE, GROUP_QUESTION_TYPE]} type={QUESTION_TYPE}
                              className={'default'}>
                        {questionsDetails.map((question, index) =>
                            <>
                                <RenderQuestion question={question} index={index}/>
                                {question?.subQuestions &&
                                <DropZone acceptType={QUESTION_TYPE}
                                          className={'group_question_drop_zone'}
                                          type={GROUP_QUESTION_TYPE}
                                          groupQuestionId={question.id}
                                          addSubQuestionToGroupQuestion={(subQuestion, groupQuestionId) => addSubQuestionToGroupQuestion(subQuestion, groupQuestionId)}>
                                    {question.subQuestions.map((subQuestion, index) =>
                                        <RenderQuestion question={subQuestion} index={index}/>)}
                                </DropZone>
                                }

                            </>
                        )}
                    </DropZone>
                    {appreciationPage.length ? <RenderQuestion question={appreciationPage[0]} index={0}/> :
                        <DropZone acceptType={APPRECIATION_TYPE} type={APPRECIATION_TYPE}
                                  addAppreciationPage={(appreciationPageId) => addAppreciationPage(appreciationPageId)}
                                  className={'default'}/>}
                </div>
            </div>
        </DndProvider>

    );

}


export default BuildPage
