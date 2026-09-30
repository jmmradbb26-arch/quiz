import { createQuiz, validateQuestions } from "./quiz.js";
import { createQuizUI } from "./ui.js";

const root = document.querySelector("#app");

function showLoadError(message) {
  root.innerHTML = `
    <section class="panel error-panel" aria-labelledby="error-title">
      <p class="eyebrow">Quiz Computacional</p>
      <h1 id="error-title">Não foi possível iniciar o quiz</h1>
      <p id="load-error-message" role="alert"></p>
      <p>Confira se os arquivos estão sendo servidos por um servidor local e tente atualizar a página.</p>
    </section>
  `;
  root.querySelector("#load-error-message").textContent = message;
}

async function initialize() {
  try {
    const response = await fetch("data/questions.json");
    if (!response.ok) {
      throw new Error("O arquivo de questões não foi encontrado.");
    }

    const questions = validateQuestions(await response.json());
    const quiz = createQuiz(questions);
    createQuizUI(root, quiz).render();
  } catch (error) {
    const message = error instanceof TypeError
      ? "Os dados locais não puderam ser carregados. Inicie a aplicação por um servidor HTTP local."
      : error.message || "Ocorreu um erro inesperado ao carregar as questões.";
    showLoadError(message);
  }
}

initialize();
