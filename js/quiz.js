export function validateQuestions(data) {
  const questions = Array.isArray(data) ? data : data?.questions;

  if (!Array.isArray(questions) || questions.length !== 10) {
    throw new Error("O conjunto precisa conter exatamente 10 questões.");
  }

  const questionIds = new Set();

  for (const [questionIndex, question] of questions.entries()) {
    if (!question || typeof question !== "object") {
      throw new Error(`A questão ${questionIndex + 1} tem formato inválido.`);
    }

    if (typeof question.id !== "string" || !question.id.trim() || questionIds.has(question.id)) {
      throw new Error(`A questão ${questionIndex + 1} precisa ter um identificador único.`);
    }
    questionIds.add(question.id);

    if (typeof question.prompt !== "string" || !question.prompt.trim()) {
      throw new Error(`A questão ${questionIndex + 1} precisa ter um enunciado.`);
    }

    if (!Array.isArray(question.choices) || question.choices.length !== 4) {
      throw new Error(`A questão ${questionIndex + 1} precisa ter exatamente quatro alternativas.`);
    }

    const choiceIds = new Set();
    for (const choice of question.choices) {
      if (!choice || typeof choice.id !== "string" || !choice.id.trim() || choiceIds.has(choice.id)) {
        throw new Error(`As alternativas da questão ${questionIndex + 1} precisam ter identificadores únicos.`);
      }
      if (typeof choice.text !== "string" || !choice.text.trim()) {
        throw new Error(`A questão ${questionIndex + 1} contém uma alternativa sem texto.`);
      }
      choiceIds.add(choice.id);
    }

    const correctChoiceMatches = question.choices.filter(
      (choice) => choice.id === question.correctChoiceId,
    ).length;

    if (correctChoiceMatches !== 1) {
      throw new Error(`A questão ${questionIndex + 1} precisa indicar exatamente uma alternativa correta.`);
    }
  }

  return questions;
}

export function createQuiz(data) {
  const questions = validateQuestions(data);
  let state = createInitialState();

  function createInitialState() {
    return {
      status: "not-started",
      currentQuestionIndex: 0,
      answers: Object.create(null),
      selectedChoiceId: null,
      feedback: null,
      canReviseCurrent: false,
      visitedIndices: new Set(),
    };
  }

  function getCurrentQuestion() {
    if (state.status === "not-started") return null;
    return questions[state.currentQuestionIndex];
  }

  function getCurrentAnswer() {
    const question = getCurrentQuestion();
    return question ? state.answers[question.id] ?? null : null;
  }

  function feedbackFor(answer) {
    if (!answer) return null;
    return {
      isCorrect: answer.isCorrect,
      text: answer.isCorrect ? "Resposta correta!" : "Resposta incorreta.",
    };
  }

  function getScore() {
    const answers = Object.values(state.answers);
    const correctCount = answers.filter((answer) => answer.isCorrect).length;
    const incorrectCount = answers.length - correctCount;
    return {
      correctCount,
      incorrectCount,
      percentage: Math.round((correctCount / questions.length) * 100),
      answeredCount: answers.length,
    };
  }

  return {
    getQuestionCount() {
      return questions.length;
    },

    getState() {
      return {
        status: state.status,
        currentQuestionIndex: state.currentQuestionIndex,
        selectedChoiceId: state.selectedChoiceId,
        feedback: state.feedback,
        canReviseCurrent: state.canReviseCurrent,
        visitedIndices: [...state.visitedIndices],
      };
    },

    getCurrentQuestion,
    getCurrentAnswer,
    getScore,

    getResult() {
      const lastQuestion = questions.at(-1);
      const lastAnswer = state.answers[lastQuestion.id] ?? null;
      return { ...getScore(), lastAnswer };
    },

    start() {
      if (state.status !== "not-started") return false;
      state.status = "in-progress";
      state.visitedIndices.add(0);
      return true;
    },

    selectChoice(choiceId) {
      if (state.status !== "in-progress") return false;
      const question = getCurrentQuestion();
      const validChoice = question.choices.some((choice) => choice.id === choiceId);
      if (!validChoice) return false;

      const currentAnswer = getCurrentAnswer();
      if (currentAnswer && !state.canReviseCurrent && choiceId !== currentAnswer.choiceId) {
        return false;
      }

      state.selectedChoiceId = choiceId;
      if (currentAnswer && choiceId === currentAnswer.choiceId) {
        state.feedback = feedbackFor(currentAnswer);
        state.canReviseCurrent = false;
      } else {
        state.feedback = null;
      }
      return true;
    },

    confirmAnswer() {
      if (state.status !== "in-progress" || !state.selectedChoiceId) {
        return { ok: false, reason: "no-selection" };
      }

      const question = getCurrentQuestion();
      const choiceExists = question.choices.some((choice) => choice.id === state.selectedChoiceId);
      if (!choiceExists) return { ok: false, reason: "invalid-choice" };

      const answer = {
        questionId: question.id,
        choiceId: state.selectedChoiceId,
        isCorrect: state.selectedChoiceId === question.correctChoiceId,
      };
      state.answers[question.id] = answer;
      state.feedback = feedbackFor(answer);
      state.canReviseCurrent = false;

      if (
        state.currentQuestionIndex === questions.length - 1 &&
        Object.keys(state.answers).length === questions.length
      ) {
        state.status = "completed";
        return { ok: true, completed: true };
      }

      return { ok: true, completed: false };
    },

    goPrevious() {
      if (state.status !== "in-progress" || state.currentQuestionIndex === 0) return false;
      const previousIndex = state.currentQuestionIndex - 1;
      if (!state.visitedIndices.has(previousIndex)) return false;

      state.currentQuestionIndex = previousIndex;
      const answer = getCurrentAnswer();
      state.selectedChoiceId = answer?.choiceId ?? null;
      state.feedback = feedbackFor(answer);
      state.canReviseCurrent = Boolean(answer);
      return true;
    },

    goNext() {
      if (state.status !== "in-progress" || state.currentQuestionIndex >= questions.length - 1) {
        return false;
      }

      const answer = getCurrentAnswer();
      if (!answer || state.selectedChoiceId !== answer.choiceId || !state.feedback) return false;

      const nextIndex = state.currentQuestionIndex + 1;
      state.currentQuestionIndex = nextIndex;
      state.visitedIndices.add(nextIndex);
      const nextAnswer = getCurrentAnswer();
      state.selectedChoiceId = nextAnswer?.choiceId ?? null;
      state.feedback = feedbackFor(nextAnswer);
      state.canReviseCurrent = Boolean(nextAnswer);
      return true;
    },

    canGoPrevious() {
      return state.status === "in-progress" && state.currentQuestionIndex > 0;
    },

    canGoNext() {
      const answer = getCurrentAnswer();
      return Boolean(
        state.status === "in-progress" &&
          state.currentQuestionIndex < questions.length - 1 &&
          answer &&
          state.selectedChoiceId === answer.choiceId &&
          state.feedback,
      );
    },

    restart() {
      if (state.status !== "completed") return false;
      state = createInitialState();
      state.status = "in-progress";
      state.visitedIndices.add(0);
      return true;
    },
  };
}
