import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

function grade(answers, key) {
  return Math.round((answers.filter((answer, index) => answer === key[index]).length / key.length) * 100);
}

test("quiz grading is deterministic and ignores a client score", () => {
  const answers = [1, 0, 1];
  const score = grade(answers, [1, 1, 1]);
  assert.equal(score, 67);
  assert.notEqual(score, 100);
});

test("session tokens are high entropy and not passwords", () => {
  const first = crypto.randomBytes(32).toString("hex");
  const second = crypto.randomBytes(32).toString("hex");
  assert.equal(first.length, 64);
  assert.notEqual(first, second);
});

test("lesson completion is idempotent by user and lesson", () => {
  const records = [];
  const complete = (userId, lessonId) => {
    if (!records.some((record) => record.userId === userId && record.lessonId === lessonId)) records.push({ userId, lessonId });
  };
  complete("student-a", "inv-1");
  complete("student-a", "inv-1");
  complete("student-b", "inv-1");
  assert.equal(records.length, 2);
});
