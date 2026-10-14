# Aula-desenvolvimento-web-semana-05
Finalização do mini projeto de consumo de APIs e manipulação dinâmica do DOM, aplicando os conceitos de objetos, arrays, assincronismo (Promises, async/await), Fetch API e os quatro estados de uma tela (Carregando, Erro, Vazio, Sucesso).

## 🛡️ Segurança e Boas Práticas Adotadas
* **Prevenção contra XSS:** Todos os dados recebidos pelas APIs externas foram inseridos no DOM utilizando `document.createElement()` associado ao `textContent`. O uso de `innerHTML` foi estritamente evitado para impedir a injeção de scripts maliciosos.
* **Resiliência de Rede:** Na API de CEP, foi implementado o `AbortSignal.timeout(5000)` para garantir que a aplicação não trave caso o servidor demore excessivamente para responder.
* **Tratamento de Erros HTTP:** Como o `fetch` não lança erro automaticamente em status como 404 (Not Found) ou 500 (Internal Server Error), implementamos a verificação explícita `if (!response.ok)` em todas as requisições.

## 🧠 Reflexão: `Promise.all` vs `await` Sequenciais

**Por que `Promise.all` pode ser mais rápido que vários `await` seguidos?**

Quando utilizamos vários `await` de forma sequencial, o JavaScript pausa a execução da função na primeira requisição, espera ela terminar, e só então dispara a segunda requisição. Isso significa que o tempo total será a soma do tempo de *todas* as requisições.

Em contraste, o **`Promise.all` dispara todas as requisições simultaneamente (em paralelo)**. O Event Loop delega as requisições de rede ao navegador ao mesmo tempo. A execução só volta a ser bloqueada aguardando que a requisição mais demorada do grupo termine. 

**Resumo:** O `await` sequencial gasta tempo de rede em fila indiana. O `Promise.all` aproveita o assincronismo real de I/O, otimizando drasticamente a performance quando as requisições não dependem dos dados umas das outras.
