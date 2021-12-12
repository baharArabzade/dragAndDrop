import React, {useState} from "react";
import {HTML5Backend as backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import uuid from "uuid/v4";
import RenderQuestion from "@components/Question";
import DropZone from "@components/DropZone";
import RightNavbarItem from "@components/RightNavbarItem";
import {
    RIGHT_NAVBAR_ITEMS,
    QUESTION_TYPE, APPRECIATION_TYPE, WELCOME_TYPE
} from "@components/constants";
//style
import classes from "styles/index.module.scss"
//types
import {
    questionsDetailsType,
} from "types/componentType";

const BuildPage = (): JSX.Element => {
    const [questionsDetails, setQuestionsDetails] = useState<questionsDetailsType>([])

    const addQuestion = (questionType: string): void => {
        setQuestionsDetails((prevQuestions) => [...prevQuestions, {questionType, id: uuid()}])
    };
    return (
        <DndProvider backend={backend}>
            <div>
                <div className={classes.right_Navbar}>
                    {RIGHT_NAVBAR_ITEMS.map((item) => (
                        <RightNavbarItem data={item} type={item.type}/>
                    ))}

                </div>

                <DropZone acceptType={WELCOME_TYPE}/>

                <DropZone addQuestionFunction={(questionType => addQuestion(questionType))} acceptType={QUESTION_TYPE}>

                    {questionsDetails.map((question, index) =>
                        <RenderQuestion question={question} index={index}/>
                    )

                    }
                </DropZone>
                <DropZone  acceptType={APPRECIATION_TYPE}/>
            </div>
        </DndProvider>

    );

}


export default BuildPage
