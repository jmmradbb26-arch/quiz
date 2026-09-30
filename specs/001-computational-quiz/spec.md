# Feature Specification: Quiz Computacional

**Feature Branch**: `001-computational-quiz`

**Created**: 2026-09-29

**Status**: Draft

**Input**: User description: "Desenvolver uma aplicação educacional chamada Quiz Computacional para praticar conhecimentos básicos de Computação com 10 questões de múltipla escolha, uma por vez, resposta confirmada com feedback, resultado final e opção de reiniciar, sem cadastro ou autenticação na primeira versão."

## Clarifications

### Session 2026-09-29

- Q: Antes de confirmar uma resposta, o estudante pode trocar a alternativa selecionada? → A: Sim. Pode trocar a seleção antes de confirmar; após a confirmação, só pode alterá-la voltando à questão.
- Q: Depois de responder e receber o feedback, o estudante pode voltar a questões anteriores? → A: Sim. Pode voltar e alterar respostas confirmadas; a pontuação é recalculada.
- Q: O estudante pode reiniciar o quiz antes de responder às 10 questões? → B: Não. Reiniciar só fica disponível após concluir e ver o resultado.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Responder ao quiz (Priority: P1)

Como estudante, quero responder a questões de conhecimentos básicos de Computação, uma por vez, para praticar e saber imediatamente se acertei.

**Why this priority**: Responder questões com retorno é a atividade principal e entrega o valor educacional do produto.

**Independent Test**: Iniciar um quiz e responder às questões sequencialmente; verificar apresentação de uma questão por vez, confirmação de escolha e feedback correto ou incorreto após cada resposta.

**Acceptance Scenarios**:

1. **Given** que o estudante inicia um novo quiz, **When** a primeira tela de questão é apresentada, **Then** ela exibe o enunciado e exatamente quatro alternativas, com exatamente uma correta.
2. **Given** que o estudante selecionou uma alternativa, **When** escolhe outra antes de confirmar, **Then** a nova alternativa fica selecionada e ainda não há resposta contabilizada.
3. **Given** que uma questão está sendo exibida e nenhuma alternativa foi escolhida, **When** o estudante tenta confirmar, **Then** a resposta não é registrada e ele recebe indicação de que precisa selecionar uma alternativa.
4. **Given** que o estudante selecionou uma alternativa, **When** confirma a resposta, **Then** a aplicação informa se ela está correta ou incorreta.
5. **Given** que a resposta foi confirmada, **When** o estudante avança ou volta para outra questão já visitada, **Then** a questão escolhida é exibida sem revelar questões futuras antecipadamente.
6. **Given** que o estudante voltou a uma questão respondida, **When** seleciona outra alternativa e confirma novamente, **Then** o feedback e a pontuação passam a refletir a nova resposta.
7. **Given** que o estudante respondeu à décima questão, **When** confirma sua resposta, **Then** o quiz termina e apresenta o resultado final.

---

### User Story 2 - Consultar resultado (Priority: P2)

Como estudante, quero ver meu desempenho ao concluir o quiz para entender quantas questões acertei e errei e qual foi meu percentual de acertos.

**Why this priority**: O resumo fecha a experiência de prática e mostra o resultado calculado automaticamente.

**Independent Test**: Completar o quiz com uma quantidade conhecida de acertos e conferir acertos, erros e percentual no resultado.

**Acceptance Scenarios**:

1. **Given** que as dez questões foram respondidas, **When** o resultado é exibido, **Then** são apresentados acertos, erros e percentual de acertos.
2. **Given** um resultado com A acertos, **When** a pontuação é calculada, **Then** erros são iguais a 10 menos A e percentual é igual a A dividido por 10, multiplicado por 100.
3. **Given** que todas as respostas estão corretas, **When** o resultado é exibido, **Then** são mostrados 10 acertos, 0 erros e 100% de acertos.
4. **Given** que todas as respostas estão incorretas, **When** o resultado é exibido, **Then** são mostrados 0 acertos, 10 erros e 0% de acertos.

---

### User Story 3 - Reiniciar o quiz (Priority: P3)

Como estudante, quero reiniciar o quiz após concluir uma tentativa para praticar novamente desde a primeira questão.

**Why this priority**: Repetir a prática permite ao estudante tentar novamente sem cadastro ou configuração adicional.

**Independent Test**: Concluir uma tentativa, selecionar reiniciar e verificar que a questão inicial volta a ser apresentada e que o resultado anterior não afeta a nova tentativa.

**Acceptance Scenarios**:

1. **Given** que o resultado final está visível, **When** o estudante escolhe reiniciar, **Then** uma nova tentativa começa pela primeira questão.
2. **Given** que uma nova tentativa começou, **When** o estado inicial é mostrado, **Then** nenhuma resposta ou pontuação da tentativa anterior é contabilizada.

### Edge Cases

- O estudante tenta confirmar sem selecionar uma alternativa: a questão permanece ativa e a aplicação solicita uma seleção.
- Antes da confirmação, o estudante pode trocar a alternativa selecionada. Depois, pode voltar à questão, escolher outra alternativa e confirmá-la novamente; apenas a resposta vigente conta para a pontuação.
- Não há questão seguinte após a décima; a confirmação da última resposta leva ao resultado final.
- O estudante não pode reiniciar uma tentativa em andamento; a opção de reinício fica disponível somente após a exibição do resultado final. No reinício, as respostas registradas e a pontuação da tentativa anterior são descartadas.
- O percentual deve ser calculado para todos os resultados possíveis entre 0 e 10 acertos, inclusive os extremos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A aplicação MUST permitir que qualquer estudante inicie e realize o quiz sem cadastro ou autenticação.
- **FR-002**: A aplicação MUST disponibilizar inicialmente 10 questões sobre conhecimentos básicos de Computação.
- **FR-003**: A aplicação MUST apresentar uma única questão por vez, com enunciado e exatamente quatro alternativas.
- **FR-004**: Cada questão MUST ter exatamente uma alternativa correta.
- **FR-005**: O estudante MUST poder selecionar uma alternativa, trocar a seleção enquanto a resposta não tiver sido confirmada e confirmar a alternativa atualmente selecionada.
- **FR-006**: A aplicação MUST impedir confirmação sem uma alternativa selecionada e indicar ao estudante como prosseguir.
- **FR-007**: Após a confirmação, a aplicação MUST informar se a resposta está correta ou incorreta.
- **FR-008**: Após o feedback, a aplicação MUST permitir avançar para a próxima questão e voltar a questões anteriores já visitadas. Ao alterar uma resposta confirmada, o estudante MUST confirmar novamente; então a aplicação MUST atualizar o feedback e recalcular a pontuação com base na resposta vigente.
- **FR-009**: Depois da confirmação da décima resposta, a aplicação MUST apresentar o total de acertos, o total de erros e o percentual de acertos.
- **FR-010**: A pontuação MUST ser calculada automaticamente com uma única resposta vigente por questão; erros MUST ser 10 menos acertos e percentual MUST ser acertos dividido por 10, multiplicado por 100. Qualquer alteração de resposta MUST atualizar esses totais.
- **FR-011**: A aplicação MUST permitir reiniciar somente após a conclusão e exibição do resultado final. O reinício MUST iniciar pela primeira questão, sem respostas ou pontuação herdadas da tentativa anterior.

### Key Entities *(include if feature involves data)*

- **Questão**: Unidade de prática com enunciado, quatro alternativas e a identificação de uma única alternativa correta.
- **Resposta da tentativa**: Alternativa selecionada pelo estudante para uma questão e seu resultado correto/incorreto após confirmação.
- **Tentativa**: Uma execução do quiz que reúne as respostas dadas às 10 questões e os totais calculados ao final.
- **Resultado**: Resumo da tentativa com quantidade de acertos, quantidade de erros e percentual de acertos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em uma tentativa completa, o estudante recebe exatamente 10 questões, uma por vez, cada qual com quatro alternativas e uma resposta correta.
- **SC-002**: Em todas as 10 respostas confirmadas, a aplicação apresenta feedback de correto ou incorreto antes de permitir avançar.
- **SC-003**: Para cada possível total de 0 a 10 acertos, o resultado apresenta acertos e erros cuja soma é 10, e percentual correto em incrementos de 10 pontos percentuais.
- **SC-004**: Um estudante consegue iniciar e concluir o quiz e reiniciar uma tentativa sem criar conta ou autenticar-se.
- **SC-005**: Ao reiniciar, a nova tentativa começa na primeira questão com zero respostas contabilizadas da tentativa anterior.

## Assumptions

- A primeira versão usa um conjunto inicial de 10 questões previamente definido, sem criação de perguntas pelo estudante.
- O conjunto de questões pode ser apresentado em ordem fixa; embaralhamento não é requisito.
- O percentual é exibido como valor inteiro, pois 10 questões produzem incrementos exatos de 10 pontos percentuais.
- A nova tentativa é independente da anterior; persistência de resultados entre sessões não é requisito.
- O público pode acessar a aplicação sem conta; autenticação, perfis e histórico pessoal estão fora do escopo desta versão.




