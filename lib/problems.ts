export function assignProblem(includeNegative: boolean, includeTwoDigit: boolean) {
    var sign = 1;
    const range = includeTwoDigit ? 100 : 10;
    sign = includeNegative && Math.random() > 0.5 ? -1 : 1;
    const a = Math.floor(Math.random() * range * sign);
    sign = includeNegative && Math.random() > 0.5 ? -1 : 1;
    const b = Math.floor(Math.random() * range * sign);
    var problemString = `${a} + ${b}`;
    problemString = problemString.replace(/(\d+)\s*\+\s*-(\d+)/g, "$1 - $2");
    const problemAnswer = eval(problemString);
    return { problemString, problemAnswer };
  }