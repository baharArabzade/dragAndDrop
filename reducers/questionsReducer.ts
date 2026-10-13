import update from "immutability-helper";
// constants
import { actions } from "components/constants";
// types
import {
  HandleDraggingQuestionActionInputTypes,
  QuestionType,
} from "types/componentType";

type QuestionLocation = {
  index: number;
  indexInGroup?: number;
  question?: QuestionType;
};

export type QuestionsReducerAction =
  | {
      type: "addQuestion";
      question: QuestionType;
    }
  | {
      type: "addSubQuestion";
      groupQuestionId: string;
      question: QuestionType;
    }
  | {
      type: "handleDraggingQuestion";
      dragAction: HandleDraggingQuestionActionInputTypes;
      previewId?: string;
    };

export const findQuestion = (
  questions: Array<QuestionType>,
  id: string,
): QuestionLocation => {
  const questionIndex = questions.findIndex((question) => question.id === id);

  if (questionIndex !== -1) {
    return {
      index: questionIndex,
      indexInGroup: -1,
      question: questions[questionIndex],
    };
  }

  for (let index = 0; index < questions.length; index++) {
    const subQuestionIndex = questions[index].subQuestions?.findIndex(
      (subQuestion) => subQuestion.id === id,
    );

    if (subQuestionIndex !== undefined && subQuestionIndex !== -1) {
      return {
        index,
        indexInGroup: subQuestionIndex,
        question: questions[index].subQuestions[subQuestionIndex],
      };
    }
  }

  return { index: -1 };
};

const findPreviewQuestion = (
  questions: Array<QuestionType>,
): QuestionLocation => {
  const questionIndex = questions.findIndex((question) => !question.id);

  if (questionIndex !== -1) {
    return {
      index: questionIndex,
      indexInGroup: -1,
      question: questions[questionIndex],
    };
  }

  for (let index = 0; index < questions.length; index++) {
    const subQuestionIndex = questions[index].subQuestions?.findIndex(
      (subQuestion) => !subQuestion.id,
    );

    if (subQuestionIndex !== undefined && subQuestionIndex !== -1) {
      return {
        index,
        indexInGroup: subQuestionIndex,
        question: questions[index].subQuestions[subQuestionIndex],
      };
    }
  }

  return { index: -1 };
};

const removePreviewQuestion = (
  questions: Array<QuestionType>,
): Array<QuestionType> => {
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
  questions: Array<QuestionType>,
  atIndex: number,
  atIndexInGroup: number,
  previewId: string,
): Array<QuestionType> => {
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
  questions: Array<QuestionType>,
  questionType: string,
  atIndex: number,
  atIndexInGroup: number,
): Array<QuestionType> => {
  const question: QuestionType = { questionType };

  if (questionType === "group") {
    question.subQuestions = [];
  }

  if (atIndexInGroup === -1) {
    return update(questions, {
      $splice: [[atIndex, 0, question]],
    });
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
  questions: Array<QuestionType>,
  source: QuestionLocation,
  atIndex: number,
  atIndexInGroup: number,
): Array<QuestionType> => {
  const { index, indexInGroup, question } = source;

  if (index === -1 || !question) {
    return questions;
  }

  if (indexInGroup === -1 && atIndexInGroup === -1) {
    return update(questions, {
      $splice: [
        [index, 1],
        [atIndex, 0, question],
      ],
    });
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

  if (atIndexInGroup === -1) {
    return update(questions, {
      [index]: {
        subQuestions: {
          $splice: [[indexInGroup, 1]],
        },
      },
      $splice: [[atIndex, 0, question]],
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
  questions: Array<QuestionType>,
  dragAction: HandleDraggingQuestionActionInputTypes,
  previewId?: string,
): Array<QuestionType> => {
  const { id, questionType, action } = dragAction;
  let { atIndex, atIndexInGroup } = dragAction;

  if (action === actions.deletePreViewQuestion) {
    return removePreviewQuestion(questions);
  }

  if (action === actions.afterPreViewAdd) {
    return confirmPreviewQuestion(
      questions,
      atIndex,
      atIndexInGroup,
      previewId,
    );
  }

  if (action === actions.addNewQuestionPreview) {
    const previewQuestion = findPreviewQuestion(questions);

    if (previewQuestion.index === -1) {
      return insertPreviewQuestion(
        questions,
        questionType,
        atIndex,
        atIndexInGroup,
      );
    }

    return moveQuestion(
      questions,
      previewQuestion,
      atIndex,
      atIndexInGroup,
    );
  }

  const question = findQuestion(questions, id);

  if (action === actions.addToEndOfGroupQuestion) {
    atIndexInGroup = questions[atIndex].subQuestions.length;
  }

  if (action === actions.addToEndOfQuestions) {
    atIndex = questions.length;
    atIndexInGroup = -1;
  }

  return moveQuestion(questions, question, atIndex, atIndexInGroup);
};

export const questionsReducer = (
  questions: Array<QuestionType>,
  action: QuestionsReducerAction,
): Array<QuestionType> => {
  if (action.type === "addQuestion") {
    return [...questions, action.question];
  }

  if (action.type === "addSubQuestion") {
    return questions.map((question) => {
      if (question.id !== action.groupQuestionId) {
        return question;
      }

      return {
        ...question,
        subQuestions: [...(question.subQuestions ?? []), action.question],
      };
    });
  }

  return handleDraggingQuestion(
    questions,
    action.dragAction,
    action.previewId,
  );
};
