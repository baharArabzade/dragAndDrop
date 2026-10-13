import { useCallback, useReducer, useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { v4 as uuid } from "uuid";
// constants
import {
  DRAG_ACTIONS,
  GROUP_QUESTION,
  GROUP_QUESTION_DROP_ZONE,
  NORMAL_QUESTION_TYPES,
  QUESTION_DROP_ZONE,
  QUESTION_TYPES,
  SIDEBAR_BLOCKS,
  THANK_YOU_PAGE,
  WELCOME_PAGE,
} from "components/constants";
// components
import Question from "components/Question";
import DropZone from "components/DropZone";
import SidebarItem from "components/SidebarItem";
// style
import classes from "styles/index.module.scss";
// reducers
import {
  createQuestionDetails,
  findQuestion as findQuestionInQuestions,
  questionsReducer,
} from "reducers/questionsReducer";
// types
import {
  DragActionType,
  NormalQuestionType,
  PageDetailsType,
  QuestionType,
} from "types/question";
import { translations as englishTranslations } from "translations/english";

const FormBuilderPage = (): JSX.Element => {
  const [questions, dispatchQuestions] = useReducer(questionsReducer, []);
  const [welcomePage, setWelcomePage] = useState<PageDetailsType | null>(null);
  const [thankYouPage, setThankYouPage] = useState<PageDetailsType | null>(
    null
  );
  const translations = englishTranslations;

  const addQuestion = (questionType: QuestionType): void => {
    dispatchQuestions({
      type: "addQuestion",
      question: createQuestionDetails(questionType, uuid()),
    });
  };

  const addSubQuestionToGroupQuestion = (
    subQuestionType: NormalQuestionType,
    groupQuestionId: string | undefined
  ): void => {
    if (!groupQuestionId) {
      return;
    }

    dispatchQuestions({
      type: "addSubQuestion",
      groupQuestionId,
      question: { id: uuid(), questionType: subQuestionType },
    });
  };

  const addWelcomePage = (): void => {
    setWelcomePage({ id: uuid(), questionType: WELCOME_PAGE });
  };

  const addThankYouPage = (): void => {
    setThankYouPage({ id: uuid(), questionType: THANK_YOU_PAGE });
  };

  const findQuestion = useCallback(
    (id: string | undefined) => findQuestionInQuestions(questions, id),
    [questions]
  );

  const handleDraggingQuestionAction = useCallback(
    (dragAction: DragActionType): void => {
      dispatchQuestions({
        type: "handleDraggingQuestion",
        dragAction,
        previewId:
          dragAction.action === DRAG_ACTIONS.confirmPreview
            ? uuid()
            : undefined,
      });
    },
    []
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={classes.app}>
        <aside className={classes.sidebar}>
          <h2 className={classes.sidebar_title}>
            {translations.app.sidebarTitle}
          </h2>
          <p className={classes.sidebar_hint}>{translations.app.sidebarHint}</p>
          <div className={classes.sidebar_list}>
            {SIDEBAR_BLOCKS.map((blockType) => (
              <SidebarItem
                key={blockType}
                questionType={blockType}
                handleDraggingQuestionAction={handleDraggingQuestionAction}
              />
            ))}
          </div>
        </aside>
        <main className={classes.form_container}>
          <header className={classes.page_header}>
            <h1 className={classes.page_title}>{translations.app.title}</h1>
            <p className={classes.page_subtitle}>{translations.app.subtitle}</p>
          </header>
          <div className={classes.canvas}>
            {welcomePage ? (
              <div className={classes.page_block}>
                {translations.questions[WELCOME_PAGE].titleText}
              </div>
            ) : (
              <DropZone
                acceptType={WELCOME_PAGE}
                dropZoneType={WELCOME_PAGE}
                onAddItem={addWelcomePage}
              />
            )}
            {questions.map((question, index) => (
              <div className={classes.question_block} key={question.id}>
                <Question
                  question={question}
                  isSubQuestion={false}
                  handleDraggingQuestionAction={handleDraggingQuestionAction}
                  findQuestion={findQuestion}
                />
                {question.questionType === GROUP_QUESTION && (
                  <DropZone
                    index={index}
                    acceptType={NORMAL_QUESTION_TYPES}
                    dropZoneType={GROUP_QUESTION_DROP_ZONE}
                    handleDraggingQuestionAction={handleDraggingQuestionAction}
                    onAddItem={(subQuestionType) =>
                      addSubQuestionToGroupQuestion(
                        subQuestionType,
                        question.id
                      )
                    }
                  >
                    {question.subQuestions.map((subQuestion) => (
                      <Question
                        key={subQuestion.id}
                        question={subQuestion}
                        isSubQuestion={true}
                        handleDraggingQuestionAction={
                          handleDraggingQuestionAction
                        }
                        findQuestion={findQuestion}
                      />
                    ))}
                  </DropZone>
                )}
              </div>
            ))}
            <DropZone
              onAddItem={addQuestion}
              acceptType={QUESTION_TYPES}
              dropZoneType={QUESTION_DROP_ZONE}
              handleDraggingQuestionAction={handleDraggingQuestionAction}
            />
            {thankYouPage ? (
              <div className={classes.page_block}>
                {translations.questions[THANK_YOU_PAGE].titleText}
              </div>
            ) : (
              <DropZone
                acceptType={THANK_YOU_PAGE}
                dropZoneType={THANK_YOU_PAGE}
                onAddItem={addThankYouPage}
              />
            )}
          </div>
        </main>
      </div>
    </DndProvider>
  );
};

export default FormBuilderPage;
