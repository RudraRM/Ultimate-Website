import test from "node:test";
import assert from "node:assert/strict";
import {
  generateProject,
  readProjects,
  toMarkdown,
  weekActivity,
} from "../src/engine.js";
const input = {
  title: "A client website",
  brief: "Build a homepage for customers. Include an accessible contact form.",
  type: "Website launch",
  days: 14,
};
test("creates an actionable plan, preserves the brief, and identifies missing scope", () => {
  const p = generateProject(input);
  assert.equal(p.brief, input.brief);
  assert.equal(p.tasks.length, 6);
  assert.equal(p.tasks.at(-1).dueDay, 14);
  assert.equal(p.risks.length, 2);
  assert.equal(p.requirements.length, 2);
  assert.equal(p.tasks.filter((t) => t.done).length, 0);
});
test("rejects invalid input rather than silently creating a broken plan", () => {
  for (const patch of [
    { title: " " },
    { brief: "short" },
    { type: "Unknown" },
    { days: 0 },
    { days: 200 },
    { days: 6.5 },
  ])
    assert.throws(() => generateProject({ ...input, ...patch }));
});
test("Markdown exports retain scope, questions, and completion state", () => {
  const p = generateProject(input);
  p.tasks[0].done = true;
  const md = toMarkdown(p);
  assert.ok(md.includes("- [x]"));
  assert.ok(md.includes("- [ ]"));
  assert.ok(md.includes(p.brief));
  assert.ok(md.includes("Confirm the project budget"));
});
test("handles corrupt storage, hostile shapes, and unavailable storage", () => {
  for (const value of ["bad", "{}", '[null, {}, {"id":"x"}]'])
    assert.deepEqual(readProjects({ getItem: () => value }), []);
  assert.deepEqual(
    readProjects({
      getItem: () => {
        throw Error("denied");
      },
    }),
    [],
  );
  const p = generateProject(input);
  assert.equal(readProjects({ getItem: () => JSON.stringify([p]) }).length, 1);
});
test("chart counts real local creation dates only", () => {
  const now = new Date(2026, 8, 15, 12);
  const data = weekActivity(
    [
      { createdAt: new Date(2026, 8, 15, 9).toISOString() },
      { createdAt: new Date(2026, 8, 14, 9).toISOString() },
      { createdAt: new Date(2025, 8, 15).toISOString() },
    ],
    now,
  );
  assert.equal(data.length, 7);
  assert.equal(data[6].count, 1);
  assert.equal(data[5].count, 1);
  assert.equal(
    data.reduce((s, d) => s + d.count, 0),
    2,
  );
});
