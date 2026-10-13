import React, { useCallback, useReducer, useState } from "react";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { v4 as uuid } from "uuid";
import { usePreview } from "react-dnd-preview";
import { isMobile } from "react-device-detect";
//constant
import {
  RIGHT_NAVBAR_ITEMS,
  QUESTION_TYPE,
  APPRECIATION_TYPE,
  WELCOME_TYPE,
  GROUP_QUESTION_TYPE,
  QUESTIONS_TYPES,
  actions,
} from "components/constants";
// components
import RenderQuestion from "components/Question";
import DropZone from "components/DropZone";
import RightNavbarItem from "components/RightNavbarItem";
//style
import classes from "styles/index.module.scss";
// reducers
import {
  findQuestion as findQuestionInQuestions,
  questionsReducer,
} from "reducers/questionsReducer";
//types
import {
  AppreciationPageDetailsType,
  DragItemType,
  HandleDraggingQuestionActionInputTypes,
  QuestionType,
  WelcomePageDetailsType,
} from "types/componentType";
import { translations as persianTranslations } from "translations/english";

const createQuestion = (questionType: string): QuestionType => ({
  id: uuid(),
  questionType,
  ...(questionType === "group" && { subQuestions: [] }),
});

const BuildPage = (): JSX.Element => {
  const [questionsDetails, dispatchQuestions] = useReducer(
    questionsReducer,
    [],
  );
  const [welcomePage, setWelcomePage] = useState<WelcomePageDetailsType>(null);
  const [appreciationPage, setAppreciationPage] =
    useState<AppreciationPageDetailsType>(null);
  const translations = persianTranslations;
  const MyPreview = () => {
    const preview = usePreview<DragItemType>();
    if (!preview.display) {
      return null;
    }
    const { item, style } = preview;
    return (
      <div style={{ ...style, zIndex: 2 }} className={classes.question_row}>
        {translations.questions[item.questionType].titleText}
        {item.id}
      </div>
    );
  };

  const addQuestion = (questionType: string): void => {
    dispatchQuestions({
      type: "addQuestion",
      question: createQuestion(questionType),
    });
  };

  const addSubQuestionToGroupQuestion = (
    subQuestionType: string,
    groupQuestionId: string,
  ): void => {
    dispatchQuestions({
      type: "addSubQuestion",
      groupQuestionId,
      question: createQuestion(subQuestionType),
    });
  };

  const addWelcomePage = (welcomePageId: string): void => {
    setWelcomePage({ id: welcomePageId, questionType: WELCOME_TYPE });
  };

  const addAppreciationPage = (appreciationPageId: string): void => {
    setAppreciationPage({
      id: appreciationPageId,
      questionType: APPRECIATION_TYPE,
    });
  };

  const findQuestion = useCallback(
    (id: string) => findQuestionInQuestions(questionsDetails, id),
    [questionsDetails],
  );

  const handleDraggingQuestionAction = useCallback(
    (dragAction: HandleDraggingQuestionActionInputTypes): void => {
      dispatchQuestions({
        type: "handleDraggingQuestion",
        dragAction,
        previewId:
          dragAction.action === actions.afterPreViewAdd ? uuid() : undefined,
      });
    },
    [],
  );

  return (
    <DndProvider
      backend={isMobile ? TouchBackend : HTML5Backend}
      options={{ enableMouseEvents: true }}
    >
      <div>
        {isMobile && <MyPreview />}
        <div className={classes.right_Navbar}>
          {RIGHT_NAVBAR_ITEMS.map((question) => (
            <RightNavbarItem
              key={question.questionType}
              questionType={question.questionType}
              handleDraggingQuestionAction={handleDraggingQuestionAction}
            />
          ))}
        </div>
        <div className={classes.form_container}>
          {welcomePage ? (
            <div className={`${classes.question_row}`}>
              {translations.questions[WELCOME_TYPE].titleText}
            </div>
          ) : (
            <DropZone
              acceptType={WELCOME_TYPE}
              dropZoneType={WELCOME_TYPE}
              addItemFunction={(welcomePageId) => addWelcomePage(welcomePageId)}
            />
          )}
          {questionsDetails.map((question, index) => (
            <div key={`${question.id}`}>
              <RenderQuestion
                question={question}
                id={question.id}
                isSubQuestion={false}
                handleDraggingQuestionAction={handleDraggingQuestionAction}
                findQuestion={findQuestion}
              />
              {question?.subQuestions && (
                <DropZone
                  index={index}
                  acceptType={QUESTIONS_TYPES.filter(
                    (questionType) => questionType != "group",
                  )}
                  dropZoneType={GROUP_QUESTION_TYPE}
                  findQuestion={findQuestion}
                  groupQuestionId={question.id}
                  handleDraggingQuestionAction={handleDraggingQuestionAction}
                  addItemFunction={(subQuestion, groupQuestionId) =>
                    addSubQuestionToGroupQuestion(subQuestion, groupQuestionId)
                  }
                >
                  {question.subQuestions.map((subQuestion, index) => (
                    <RenderQuestion
                      key={subQuestion.id}
                      question={subQuestion}
                      index={index}
                      isSubQuestion={true}
                      handleDraggingQuestionAction={
                        handleDraggingQuestionAction
                      }
                      findQuestion={findQuestion}
                      id={subQuestion.id}
                    />
                  ))}
                </DropZone>
              )}
            </div>
          ))}
          <DropZone
            addItemFunction={(questionType) => addQuestion(questionType)}
            acceptType={QUESTIONS_TYPES}
            dropZoneType={QUESTION_TYPE}
            handleDraggingQuestionAction={handleDraggingQuestionAction}
            findQuestion={findQuestion}
          />
          {appreciationPage ? (
            <div className={`${classes.question_row}`}>
              {translations.questions[APPRECIATION_TYPE].titleText}
            </div>
          ) : (
            <DropZone
              acceptType={APPRECIATION_TYPE}
              dropZoneType={APPRECIATION_TYPE}
              addItemFunction={(appreciationPageId) =>
                addAppreciationPage(appreciationPageId)
              }
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default BuildPage;
