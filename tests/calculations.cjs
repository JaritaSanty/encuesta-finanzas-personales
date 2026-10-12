const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  new Function('exports', 'require', output)(exports, name => load(path.resolve(path.dirname(file), name + '.ts')));
  cache.set(file, exports);
  return exports;
}
const { stressSurvey, scriptsSurvey } = load('data/questions.ts');
const { calculateStressResult, calculateScriptsResult } = load('lib/calculations.ts');
const answers = (survey, value) => Object.fromEntries(survey.questions.map(q => [q.id, value]));
for (const value of [1, 3, 5]) {
  const result = calculateStressResult(stressSurvey.questions, answers(stressSurvey, value));
  assert.equal(result.total, 16 * value);
  assert.ok(result.dimensions.every(d => d.score === 4 * value));
}
const withExtra = { ...answers(stressSurvey, 1), 99: 5 };
assert.equal(calculateStressResult(stressSurvey.questions, withExtra).total, 16);
for (const invalid of [0, 6, 2.5, '3', undefined]) {
  assert.throws(() => calculateStressResult(stressSurvey.questions, { ...answers(stressSurvey, 3), 1: invalid }));
}
assert.throws(() => calculateStressResult(stressSurvey.questions, {}));
const tied = calculateScriptsResult(scriptsSurvey.questions, answers(scriptsSurvey, 3));
assert.equal(tied.mixedProfile, true);
const specific = answers(scriptsSurvey, 1);
for (let id = 13; id <= 16; id++) specific[id] = 5;
const profile = calculateScriptsResult(scriptsSurvey.questions, specific);
assert.equal(profile.dominant, 'Guion vigilante');
assert.equal(profile.mixedProfile, false);
assert.match(profile.recommendations[0], /necesidades/);
console.log('OK: extremos, promedio, respuestas inválidas, claves extra, empates y recomendaciones.');
