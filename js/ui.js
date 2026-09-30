function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

export function createQuizUI(root, quiz) {
  let validationMessage = "";

  function focusAfterRender(selector) {
    if (!selector) return;
    requestAnimationFrame(() => root.querySelector(selector)?.focus());
  }

  function renderStart(focusSelector) {
    root.innerHTML = `
      <section class="panel start-panel" aria-labelledby="page-title">
        <p class="eyebrow">Prática de computação</p>
        <h1 id="page-title">Quiz Computacional</h1>
        <p class="intro-copy">Responda a 10 questões sobre conhecimentos básicos de Computação. Você verá uma questão por vez e receberá um retorno a cada resposta.</p>
        <ul class="feature-list">
          <li>10 questões</li>
          <li>4 alternativas por questão</li>
          <li>Resultado ao concluir</li>
        </ul>
        <button class="button button-primary" id="start-quiz" type="button">Começar quiz</button>
      </section>
    `;

    root.querySelector("#start-quiz").addEventListener("click", () => {
      quiz.start();
      validationMessage = "";
      render("#question-title");
    });
    focusAfterRender(focusSelector);
  }

  function renderQuestion(focusSelector) {
    const state = quiz.getState();
    const question = quiz.getCurrentQuestion();
    const answer = quiz.getCurrentAnswer();
    const questionNumber = state.currentQuestionIndex + 1;
    const selectionLocked = Boolean(answer && !state.canReviseCurrent);
    const feedback = state.feedback;

    const choices = question.choices.map((choice, index) => {
      const choiceId = `choice-${questionNumber}-${index + 1}`;
      const isSelected = state.selectedChoiceId === choice.id;
      const checked = isSelected ? "checked" : "";
      const selectedClass = isSelected ? " choice-selected" : "";
      return `
        <label class="choice-card${selectedClass}" for="${choiceId}">
          <input id="${choiceId}" name="answer" type="radio" value="${escapeHtml(choice.id)}" ${checked} />
          <span class="choice-marker" aria-hidden="true">${String.fromCharCode(65 + index)}</span>
          <span class="choice-text">${escapeHtml(choice.text)}</span>
        </label>
      `;
    }).join("");

    const feedbackMarkup = feedback
      ? `<p class="feedback ${feedback.isCorrect ? "feedback-correct" : "feedback-incorrect"}" id="feedback" role="status" aria-live="polite" tabindex="-1">${feedback.text}</p>`
      : validationMessage
        ? `<p class="feedback feedback-error" id="answer-error" role="alert" tabindex="-1">${escapeHtml(validationMessage)}</p>`
        : `<p class="feedback feedback-empty" id="feedback" role="status" aria-live="polite"></p>`;

    root.innerHTML = `
      <section class="panel quiz-panel" aria-labelledby="question-title">
        <header class="quiz-header">
          <p class="eyebrow">Quiz Computacional</p>
          <p class="question-count">Questão <strong>${questionNumber}</strong> de ${quiz.getQuestionCount()}</p>
          <progress class="quiz-progress" value="${questionNumber}" max="${quiz.getQuestionCount()}" aria-label="Progresso do quiz"></progress>
        </header>

        <form id="answer-form" novalidate>
          <h1 class="question-title" id="question-title" tabindex="-1">${escapeHtml(question.prompt)}</h1>
          <fieldset class="answer-options" ${selectionLocked ? "disabled" : ""}>
            <legend class="visually-hidden">Escolha uma alternativa para esta questão</legend>
            ${choices}
          </fieldset>
          ${feedbackMarkup}
          <div class="quiz-actions">
            <button class="button button-secondary" id="previous-question" type="button" ${quiz.canGoPrevious() ? "" : "disabled"}>Questão anterior</button>
            <button class="button button-primary" id="confirm-answer" type="submit" ${selectionLocked ? "disabled" : ""}>Confirmar resposta</button>
            <button class="button button-primary" id="next-question" type="button" ${quiz.canGoNext() ? "" : "disabled"}>Próxima questão</button>
          </div>
        </form>
      </section>
    `;

    root.querySelectorAll('input[name="answer"]').forEach((radio) => {
      radio.addEventListener("change", (event) => {
        quiz.selectChoice(event.currentTarget.value);
        validationMessage = "";
        render(`#${event.currentTarget.id}`);
      });
    });

    root.querySelector("#answer-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const result = quiz.confirmAnswer();
      if (!result.ok) {
        validationMessage = "Selecione uma alternativa antes de confirmar sua resposta.";
        render("#answer-error");
        return;
      }

      validationMessage = "";
      render(result.completed ? "#result-title" : "#feedback");
    });

    root.querySelector("#previous-question").addEventListener("click", () => {
      if (quiz.goPrevious()) {
        validationMessage = "";
        render("#question-title");
      }
    });

    root.querySelector("#next-question").addEventListener("click", () => {
      if (quiz.goNext()) {
        validationMessage = "";
        render("#question-title");
      }
    });

    focusAfterRender(focusSelector);
  }

  function renderResult(focusSelector) {
    const result = quiz.getResult();
    const finalFeedback = result.lastAnswer?.isCorrect
      ? "Sua última resposta está correta!"
      : "Sua última resposta está incorreta.";

    root.innerHTML = `
      <section class="panel result-panel" aria-labelledby="result-title">
        <p class="eyebrow">Quiz concluído</p>
        <h1 id="result-title" tabindex="-1">Seu resultado</h1>
        <p class="result-feedback" role="status" aria-live="polite">${finalFeedback}</p>
        <dl class="result-summary">
          <div class="result-card result-card-correct">
            <dt>Acertos</dt>
            <dd>${result.correctCount}</dd>
          </div>
          <div class="result-card result-card-incorrect">
            <dt>Erros</dt>
            <dd>${result.incorrectCount}</dd>
          </div>
          <div class="result-card result-card-percentage">
            <dt>Percentual de acertos</dt>
            <dd>${result.percentage}%</dd>
          </div>
        </dl>
        <button class="button button-primary" id="restart-quiz" type="button">Reiniciar quiz</button>
      </section>
    `;

    root.querySelector("#restart-quiz").addEventListener("click", () => {
      quiz.restart();
      validationMessage = "";
      render("#question-title");
    });
    focusAfterRender(focusSelector);
  }

  function render(focusSelector) {
    const { status } = quiz.getState();
    if (status === "not-started") {
      renderStart(focusSelector);
    } else if (status === "completed") {
      renderResult(focusSelector);
    } else {
      renderQuestion(focusSelector);
    }
  }

  return { render };
}
