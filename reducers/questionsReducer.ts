import update from "immutability-helper";
// constants
import { DRAG_ACTIONS, GROUP_QUESTION } from "components/constants";
// types
import {
  BaseQuestionDetailsType,
  HandleDraggingQuestionActionInputTypes,
  NormalQuestionDetailsType,
  QuestionDetailsType,
  QuestionLocationType,
  QuestionType,
} from "types/componentType";

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
      dragAction: HandleDraggingQuestionActionInputTypes;
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

  return { index: -1 };
};

export const findQuestion = (
  questions: QuestionDetailsType[],
  id: string
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
  atIndex: number,
  atIndexInGroup: number,
  previewId: string
): QuestionDetailsType[] => {
  if (atIndexInGroup === -1) {
    return update(questions, {
      [atIndex]: { $merge: { id: previewId } },
    });
  }

  return update(questions, {
    [atIndex]: {
      subQuestions: {
        [atIndexInGroup]: { $merge: { id: previewId } },
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
  dragAction: HandleDraggingQuestionActionInputTypes,
  previewId?: string
): QuestionDetailsType[] => {
  const { id, questionType, action } = dragAction;
  let { atIndex, atIndexInGroup } = dragAction;

  if (action === DRAG_ACTIONS.deletePreViewQuestion) {
    return removePreviewQuestion(questions);
  }

  if (action === DRAG_ACTIONS.afterPreViewAdd) {
    return confirmPreviewQuestion(
      questions,
      atIndex,
      atIndexInGroup,
      previewId
    );
  }

  if (action === DRAG_ACTIONS.addNewQuestionPreview) {
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

  const question = findQuestion(questions, id);

  if (action === DRAG_ACTIONS.addToEndOfGroupQuestion) {
    const groupQuestion = questions[atIndex];

    if (groupQuestion.questionType !== GROUP_QUESTION) {
      return questions;
    }

    atIndexInGroup = groupQuestion.subQuestions.length;
  }

  if (action === DRAG_ACTIONS.addToEndOfQuestions) {
    atIndex = questions.length;
    atIndexInGroup = -1;
  }

  return moveQuestion(questions, question, atIndex, atIndexInGroup);
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
