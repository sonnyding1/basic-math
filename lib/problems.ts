export function assignProblem(includeNegative: boolean) {
    var sign = 1;
    sign = includeNegative && Math.random() > 0.5 ? -1 : 1;
    const a = Math.floor(Math.random() * 10 * sign);
    sign = includeNegative && Math.random() > 0.5 ? -1 : 1;
    const b = Math.floor(Math.random() * 10 * sign);
    var problemString = `${a} + ${b}`;
    problemString = problemString.replace(/(\d+)\s*\+\s*-(\d+)/g, "$1 - $2");
    const problemAnswer = eval(problemString);
    return { problemString, problemAnswer };
  }