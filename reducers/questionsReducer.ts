import update from "immutability-helper";
// constants
import { GROUP_QUESTION } from "constants/formBuilder";
// types
import {
  BaseQuestionDetailsType,
  DragActionType,
  NormalQuestionDetailsType,
  QuestionDetailsType,
  QuestionLocationType,
  QuestionType,
} from "types/question";

export type QuestionsReducerAction =
  | {
      type: "addQuestion";
      question: QuestionDetailsType;
    }
  | {
      type: "addSubQuestion";
      groupQuestionId: string;
      question: NormalQuestionDetailsType;
    }
  | {
      type: "handleDraggingQuestion";
      dragAction: DragActionType;
      previewId?: string;
    };

export const createQuestionDetails = (
  questionType: QuestionType,
  id?: string
): QuestionDetailsType => {
  if (questionType === GROUP_QUESTION) {
    return { id, questionType, subQuestions: [] };
  }

  return { id, questionType };
};

const findQuestionLocation = (
  questions: QuestionDetailsType[],
  isMatch: (question: BaseQuestionDetailsType) => boolean
): QuestionLocationType => {
  const questionIndex = questions.findIndex(isMatch);

  if (questionIndex !== -1) {
    return {
      index: questionIndex,
      indexInGroup: -1,
      question: questions[questionIndex],
    };
  }

  for (let index = 0; index < questions.length; index++) {
    const question = questions[index];

    if (question.questionType !== GROUP_QUESTION) {
      continue;
    }

    const subQuestionIndex = question.subQuestions.findIndex(isMatch);

    if (subQuestionIndex !== -1) {
      return {
        index,
        indexInGroup: subQuestionIndex,
        question: question.subQuestions[subQuestionIndex],
      };
    }
  }

  return { index: -1, indexInGroup: -1 };
};

export const findQuestion = (
  questions: QuestionDetailsType[],
  id: string | undefined
): QuestionLocationType =>
  findQuestionLocation(questions, (question) => question.id === id);

const findPreviewQuestion = (
  questions: QuestionDetailsType[]
): QuestionLocationType =>
  findQuestionLocation(questions, (question) => !question.id);

const removePreviewQuestion = (
  questions: QuestionDetailsType[]
): QuestionDetailsType[] => {
  const previewQuestion = findPreviewQuestion(questions);

  if (previewQuestion.index === -1) {
    return questions;
  }

  if (previewQuestion.indexInGroup === -1) {
    return update(questions, {
      $splice: [[previewQuestion.index, 1]],
    });
  }

  return update(questions, {
    [previewQuestion.index]: {
      subQuestions: {
        $splice: [[previewQuestion.indexInGroup, 1]],
      },
    },
  });
};

const confirmPreviewQuestion = (
  questions: QuestionDetailsType[],
  previewId: string
): QuestionDetailsType[] => {
  const { index, indexInGroup } = findPreviewQuestion(questions);

  if (index === -1) {
    return questions;
  }

  if (indexInGroup === -1) {
    return update(questions, {
      [index]: { $merge: { id: previewId } },
    });
  }

  return update(questions, {
    [index]: {
      subQuestions: {
        [indexInGroup]: { $merge: { id: previewId } },
      },
    },
  });
};

const insertPreviewQuestion = (
  questions: QuestionDetailsType[],
  questionType: QuestionType,
  atIndex: number,
  atIndexInGroup: number
): QuestionDetailsType[] => {
  const question = createQuestionDetails(questionType);

  if (atIndexInGroup === -1) {
    return update(questions, {
      $splice: [[atIndex, 0, question]],
    });
  }

  if (question.questionType === GROUP_QUESTION) {
    return questions;
  }

  return update(questions, {
    [atIndex]: {
      subQuestions: {
        $splice: [[atIndexInGroup, 0, question]],
      },
    },
  });
};

const moveQuestion = (
  questions: QuestionDetailsType[],
  source: QuestionLocationType,
  atIndex: number,
  atIndexInGroup: number
): QuestionDetailsType[] => {
  const { index, indexInGroup, question } = source;

  if (index === -1 || !question) {
    return questions;
  }

  if (atIndexInGroup === -1) {
    if (indexInGroup === -1) {
      return update(questions, {
        $splice: [
          [index, 1],
          [atIndex, 0, question],
        ],
      });
    }

    return update(questions, {
      [index]: {
        subQuestions: {
          $splice: [[indexInGroup, 1]],
        },
      },
      $splice: [[atIndex, 0, question]],
    });
  }

  if (question.questionType === GROUP_QUESTION) {
    return questions;
  }

  if (indexInGroup === -1) {
    return update(questions, {
      $splice: [[index, 1]],
      [atIndex]: {
        subQuestions: {
          $splice: [[atIndexInGroup, 0, question]],
        },
      },
    });
  }

  if (index === atIndex) {
    return update(questions, {
      [index]: {
        subQuestions: {
          $splice: [
            [indexInGroup, 1],
            [atIndexInGroup, 0, question],
          ],
        },
      },
    });
  }

  return update(questions, {
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
  });
};

const handleDraggingQuestion = (
  questions: QuestionDetailsType[],
  dragAction: DragActionType,
  previewId?: string
): QuestionDetailsType[] => {
  if (dragAction.action === "removePreview") {
    return removePreviewQuestion(questions);
  }

  if (dragAction.action === "confirmPreview") {
    if (!previewId) {
      return questions;
    }

    return confirmPreviewQuestion(questions, previewId);
  }

  if (dragAction.action === "addPreview") {
    const { questionType, atIndex, atIndexInGroup } = dragAction;
    const previewQuestion = findPreviewQuestion(questions);

    if (previewQuestion.index === -1) {
      return insertPreviewQuestion(
        questions,
        questionType,
        atIndex,
        atIndexInGroup
      );
    }

    return moveQuestion(questions, previewQuestion, atIndex, atIndexInGroup);
  }

  const question = findQuestion(questions, dragAction.id);

  if (dragAction.action === "moveToEndOfGroup") {
    const groupQuestion = questions[dragAction.atIndex];

    if (groupQuestion.questionType !== GROUP_QUESTION) {
      return questions;
    }

    return moveQuestion(
      questions,
      question,
      dragAction.atIndex,
      groupQuestion.subQuestions.length
    );
  }

  if (dragAction.action === "moveToEnd") {
    return moveQuestion(questions, question, questions.length, -1);
  }

  return moveQuestion(
    questions,
    question,
    dragAction.atIndex,
    dragAction.atIndexInGroup
  );
};

export const questionsReducer = (
  questions: QuestionDetailsType[],
  action: QuestionsReducerAction
): QuestionDetailsType[] => {
  if (action.type === "addQuestion") {
    return [...questions, action.question];
  }

  if (action.type === "addSubQuestion") {
    return questions.map((question) => {
      if (
        question.id !== action.groupQuestionId ||
        question.questionType !== GROUP_QUESTION
      ) {
        return question;
      }

      return {
        ...question,
        subQuestions: [...question.subQuestions, action.question],
      };
    });
  }

  return handleDraggingQuestion(questions, action.dragAction, action.previewId);
};
