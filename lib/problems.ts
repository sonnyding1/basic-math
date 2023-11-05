export function assignProblem() {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    const problemString = `${a} + ${b}`;
    const problemAnswer = eval(problemString);
    return { problemString, problemAnswer };
  }