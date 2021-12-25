import React, { useState, useCallback } from "react";
import update from "immutability-helper";
import { HTML5Backend as backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import uuid from "uuid/v4";
//constant
import {
  RIGHT_NAVBAR_ITEMS,
  QUESTION_TYPE,
  APPRECIATION_TYPE,
  WELCOME_TYPE,
  GROUP_QUESTION_TYPE,
  QUESTIONS_TYPES,
} from "components/constants";
// components
import RenderQuestion from "components/Question";
import DropZone from "components/DropZone";
import RightNavbarItem from "components/RightNavbarItem";
//style
import classes from "styles/index.module.scss";
//types
import {
  AppreciationPageDetailsType,
  HandleDraggingQuestionActionInputTypes,
  QuestionType,
  WelcomePageDetailsType,
} from "types/componentType";
import { translations as persianTranslations } from "translations/persian";

const BuildPage = (): JSX.Element => {
  const [questionsDetails, setQuestionsDetails] = useState<Array<QuestionType>>(
    []
  );
  const [welcomePage, setWelcomePage] = useState<WelcomePageDetailsType>(null);
  const [appreciationPage, setAppreciationPage] =
    useState<AppreciationPageDetailsType>(null);
  const translations = persianTranslations;
  const addQuestion = (questionType: string): void => {
    let newQuestion: QuestionType = null;
    if (questionType === "group")
      newQuestion = { questionType, id: uuid(), subQuestions: [] };
    else {
      newQuestion = { questionType, id: uuid() };
    }
    setQuestionsDetails(
      (prevQuestions): Array<QuestionType> => [...prevQuestions, newQuestion]
    );
  };
  const addSubQuestionToGroupQuestion = (
    subQuestionType: string,
    groupQuestionId: string
  ): void => {
    let index = questionsDetails.findIndex(
      (question) => question.id === groupQuestionId
    );
    setQuestionsDetails((prevQuestions) => {
      let updatedQuestion = prevQuestions[index];
      updatedQuestion.subQuestions.push({
        id: uuid(),
        questionType: subQuestionType,
      });
      return prevQuestions.map((question) =>
        question.id === groupQuestionId ? updatedQuestion : question
      );
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

  const findPreViewQuestion = useCallback(() => {
    for (let i = 0; i < questionsDetails.length; i++) {
      if (!questionsDetails[i].id) {
        return {
          index: i,
          indexInGroup: -1,
          question: questionsDetails[i],
        };
      }
      if (questionsDetails[i]?.subQuestions?.length) {
        for (let j = 0; j < questionsDetails[i].subQuestions.length; j++) {
          if (!questionsDetails[i].subQuestions[j].id) {
            return {
              index: i,
              indexInGroup: j,
              question: questionsDetails[i].subQuestions[j],
            };
          }
        }
      }
    }
    return {
      index: -1,
    };
  }, [questionsDetails]);

  const findQuestion = useCallback(
    (
      id: string
    ): { index: number; indexInGroup?: number; question?: QuestionType } => {
      for (let i = 0; i < questionsDetails.length; i++) {
        if (questionsDetails[i].id === id) {
          return {
            index: i,
            indexInGroup: -1,
            question: questionsDetails[i],
          };
        }
        if (questionsDetails[i]?.subQuestions?.length) {
          for (let j = 0; j < questionsDetails[i].subQuestions.length; j++) {
            if (questionsDetails[i].subQuestions[j].id === id) {
              return {
                index: i,
                indexInGroup: j,
                question: questionsDetails[i].subQuestions[j],
              };
            }
          }
        }
      }

      return {
        index: -1,
      };
    },
    [questionsDetails]
  );
  const handleDraggingQuestionAction = useCallback(
    ({
      id,
      questionType,
      atIndex,
      atIndexInGroup,
      action,
    }: HandleDraggingQuestionActionInputTypes): void => {
      if (action === "deletePreViewQuestion") {
        const preViewQuestion = findPreViewQuestion();
        if (preViewQuestion.index === -1) return;
        if (preViewQuestion.indexInGroup === -1) {
          setQuestionsDetails(
            update(questionsDetails, {
              $splice: [[preViewQuestion.index, 1]],
            })
          );
        } else {
          setQuestionsDetails(
            update(questionsDetails, {
              [preViewQuestion.index]: {
                subQuestions: {
                  $splice: [[preViewQuestion.indexInGroup, 1]],
                },
              },
            })
          );
        }

        return;
      }
      if (action === "afterPreViewAdd") {
        if (atIndexInGroup === -1) {
          setQuestionsDetails(
            update(questionsDetails, {
              [atIndex]: { $merge: { id: uuid() } },
            })
          );
        } else {
          setQuestionsDetails(
            update(questionsDetails, {
              [atIndex]: {
                subQuestions: { [atIndexInGroup]: { $merge: { id: uuid() } } },
              },
            })
          );
        }
        return;
      }
      if (action === "addNewQuestionPreview") {
        let preViewQuestion = findPreViewQuestion();
        let question: QuestionType = { questionType };
        if (questionType === "group") {
          question.subQuestions = [];
        }
        if (preViewQuestion.index === -1) {
          if (atIndexInGroup === -1) {
            setQuestionsDetails(
              update(questionsDetails, {
                $splice: [[atIndex, 0, question]],
              })
            );
          } else {
            setQuestionsDetails(
              update(questionsDetails, {
                [atIndex]: {
                  subQuestions: { $splice: [[atIndexInGroup, 0, question]] },
                },
              })
            );
          }
          return;
        }
      }

      let { question, index, indexInGroup } =
        action === "addNewQuestionPreview"
          ? findPreViewQuestion()
          : findQuestion(id);

      if (action === "addToEndOfGroupQuestion") {
        atIndexInGroup = questionsDetails[atIndex].subQuestions.length;
      }
      if (action === "addToEndOfQuestions") {
        atIndex = questionsDetails.length;
        atIndexInGroup = -1;
      }
      if (indexInGroup === -1) {
        if (atIndexInGroup === -1) {
          /// 2 mainQuestion
          setQuestionsDetails(
            update(questionsDetails, {
              $splice: [
                [index, 1],
                [atIndex, 0, question],
              ],
            })
          );
          return;
        } else {
          setQuestionsDetails(
            update(questionsDetails, {
              $splice: [[index, 1]],
              [atIndex]: {
                subQuestions: { $splice: [[atIndexInGroup, 0, question]] },
              },
            })
          );
          return;
        }
      } else {
        if (atIndexInGroup === -1) {
          setQuestionsDetails(
            update(questionsDetails, {
              [index]: {
                subQuestions: {
                  $splice: [[indexInGroup, 1]],
                },
              },
              $splice: [[atIndex, 0, question]],
            })
          );
          return;
        } else {
          if (index === atIndex) {
            setQuestionsDetails(
              update(questionsDetails, {
                [index]: {
                  subQuestions: {
                    $splice: [
                      [indexInGroup, 1],
                      [atIndexInGroup, 0, question],
                    ],
                  },
                },
              })
            );
          } else {
            setQuestionsDetails(
              update(questionsDetails, {
                [index]: {
                  subQuestions: {
                    $splice: [[indexInGroup, 1]],
                  },
                },
                [atIndex]: {
                  subQuestions: {
                    $splice: [[atIndexInGroup, 0, question]],
                  },
                },
              })
            );
          }
          return;
        }
      }
    },
    [findQuestion, questionsDetails, setQuestionsDetails]
  );

  return (
    <DndProvider backend={backend}>
      <div>
        <div className={classes.right_Navbar}>
          {RIGHT_NAVBAR_ITEMS.map((question) => (
            <RightNavbarItem
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
            <>
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
                    (questionType) => questionType != "group"
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
            </>
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
