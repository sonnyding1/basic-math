import { ComputeEngine } from '@cortex-js/compute-engine';
// import math from 'mathjs';
// import { simplify } from 'mathjs';

export function assignAdditionProblem(includeNegative: boolean, includeTwoDigit: boolean) {
  var sign = 1;
  const range = includeTwoDigit ? 99 : 9;
  sign = includeNegative && Math.random() > 0.5 ? -1 : 1;
  const a = Math.floor(Math.random() * range * sign);
  sign = includeNegative && Math.random() > 0.5 ? -1 : 1;
  const b = Math.floor(Math.random() * range * sign);
  var problemString = `${a} + ${b}`;
  problemString = problemString.replace(/(\d+)\s*\+\s*-(\d+)/g, "$1 - $2");
  const problemAnswer = eval(problemString);
  return { problemString, problemAnswer };
}

export function additionWeight(includeNegative: boolean, includeTwoDigit: boolean) {
  var weight = 1;
  if (includeNegative) {
    weight += 1;
  }
  if (includeTwoDigit) {
    weight += 2;
  }
  return weight;
}

export function assignMultiplicationProblem(includeNegative: boolean, includeTwoDigit: boolean) {
  var sign = 1;
  const range = includeTwoDigit ? 99 : 9;
  sign = includeNegative && Math.random() > 0.5 ? -1 : 1;
  const a = Math.floor(Math.random() * range * sign);
  sign = includeNegative && Math.random() > 0.5 ? -1 : 1;
  const b = Math.floor(Math.random() * range * sign);
  var problemString = `${a} * ${b}`;
  const problemAnswer = eval(problemString);
  problemString = problemString.replace(/(\d+)\s*\*\s*-(\d+)/g, "$1 * (-$2)");
  problemString = problemString.replace(/\*/g, "\\times");
  return { problemString, problemAnswer };
}

export function multiplicationWeight(includeNegative: boolean, includeTwoDigit: boolean) {
  var weight = 1;
  if (includeNegative) {
    weight += 1;
  }
  if (includeTwoDigit) {
    weight += 2;
  }
  return weight;
}

export function assignDivisionProblem(includeNegative: boolean, includeTwoDigit: boolean) {
  var sign = 1;
  const range = includeTwoDigit ? 99 : 9;
  sign = includeNegative && Math.random() > 0.5 ? -1 : 1;
  const a = Math.floor((Math.random() * range + 1) * sign); // +1 because avoid 0
  sign = includeNegative && Math.random() > 0.5 ? -1 : 1;
  const b = Math.floor(Math.random() * range * sign);
  const c = a * b;
  var problemString = `${c} / ${a}`;
  const problemAnswer = b;
  problemString = problemString.replace(/(\d+)\s*\/\s*-(\d+)/g, "$1 / (-$2)");
  problemString = problemString.replace(/\//g, "\\div");
  return { problemString, problemAnswer };
}

export function divisionWeight(includeNegative: boolean, includeTwoDigit: boolean) {
  var weight = 1;
  if (includeNegative) {
    weight += 1;
  }
  if (includeTwoDigit) {
    weight += 2;
  }
  return weight;
}

export function assignFactorizationProblem(includeNegative: boolean, includeTwoDigit: boolean) {
  var sign = 1;
  const range = includeTwoDigit ? 99 : 9;
  const ce = new ComputeEngine();

  sign = includeNegative && Math.random() > 0.5 ? -1 : 1;
  const a = Math.floor((Math.random() * range + 1) * sign); // +1 because avoid 0
  sign = includeNegative && Math.random() > 0.5 ? -1 : 1;
  const b = Math.floor((Math.random() * range + 1) * sign);
  const problemAnswer = `(x + ${a}) * (x + ${b})`;
  var problemString = `x^2 + ${a + b}x + ${a * b}`;
  problemString = problemString.replace(/(\d+|x)\s*\+\s*-(\d+|x)/g, "$1 - $2");
  return { problemString, problemAnswer };
}

export function evalFactorizationProblem(problemString: string, userAnswer: string) {
  const processedAnswer = userAnswer.replace(/\\(left|right)/g, '');
  const regex1 = /^\(x[+-]\d+\)\*?\(x[+-]\d+\)$/;
  const regex2 = /^\(x[+-]\d+\)(\^\d+)?$/;
  if (!regex1.test(processedAnswer) && !regex2.test(processedAnswer)) {
    return false;
  }
  const ce = new ComputeEngine();
  return ce.parse(problemString).isEqual(ce.parse(processedAnswer));
}


export function factorizationWeight(includeNegative: boolean, includeTwoDigit: boolean) {
  var weight = 4;
  if (includeNegative) {
    weight += 4;
  }
  if (includeTwoDigit) {
    weight += 8;
  }
  return weight;
}