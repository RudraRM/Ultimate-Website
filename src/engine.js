export const templates = {
  "Website launch": [
    "Confirm sitemap and success criteria",
    "Create wireframes for key pages",
    "Design responsive page layouts",
    "Build and review the website",
    "Check accessibility and mobile layouts",
    "Approve launch checklist",
  ],
  "Brand identity": [
    "Confirm audience and positioning",
    "Explore visual directions",
    "Develop logo and color system",
    "Create typography guidelines",
    "Prepare brand asset exports",
    "Approve the brand handoff",
  ],
  "Content campaign": [
    "Confirm audience and campaign goal",
    "Build the editorial calendar",
    "Draft campaign content",
    "Review messaging and creative",
    "Prepare publishing assets",
    "Approve campaign delivery",
  ],
  "Product design": [
    "Confirm the user problem",
    "Map the primary user journey",
    "Create low-fidelity wireframes",
    "Design the interactive prototype",
    "Review usability and accessibility",
    "Prepare developer handoff",
  ],
};
export function generateProject({ title, brief, type, days }) {
  if (!title?.trim() || title.trim().length > 100)
    throw new Error("Add a project name of 1–100 characters.");
  if (!brief?.trim() || brief.trim().length < 30 || brief.length > 8000)
    throw new Error("Add a brief between 30 and 8,000 characters.");
  if (!templates[type]) throw new Error("Choose a supported project type.");
  const duration = Number(days);
  if (!Number.isInteger(duration) || duration < 6 || duration > 180)
    throw new Error("Choose a timeline between 6 and 180 days.");
  const sentences = brief
    .trim()
    .split(/\n|(?<=[.!?])\s+/)
    .map((s) => s.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
  const explicit = sentences.filter((s) =>
    /deliver|need|build|create|design|include|launch/i.test(s),
  );
  const risks = [];
  if (!/budget|\$|cost|usd|eur|gbp/i.test(brief))
    risks.push("Confirm the project budget before committing to scope.");
  if (!/audience|customer|user|client|visitor/i.test(brief))
    risks.push("Identify the primary audience and their needs.");
  if (!/approv|stakeholder|owner|decision/i.test(brief))
    risks.push("Assign a final approver to avoid review delays.");
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    brief: brief.trim(),
    type,
    days: duration,
    createdAt: new Date().toISOString(),
    summary: sentences[0],
    requirements: explicit.length
      ? explicit.slice(0, 8)
      : sentences.slice(0, 4),
    risks,
    tasks: templates[type].map((name, i) => ({
      id: i,
      name,
      done: false,
      dueDay: Math.ceil(((i + 1) * duration) / 6),
    })),
  };
}
export function toMarkdown(project) {
  return `# ${project.title}\n\n${project.type} · ${project.days}-day plan\n\n## Original brief\n${project.brief}\n\n## Scope extracted from brief\n${project.requirements.map((r) => "- " + r).join("\n")}\n\n## Suggested delivery plan\n${project.tasks.map((t) => `- [${t.done ? "x" : " "}] Day ${t.dueDay}: ${t.name}`).join("\n")}\n\n## Questions to resolve\n${project.risks.length ? project.risks.map((r) => "- " + r).join("\n") : "- Confirm scope and dates with your client."}\n\nGenerated locally by Briefly using structured templates. Review before sharing.\n`;
}
export function readProjects(storage) {
  try {
    const value = JSON.parse(storage.getItem("briefly.projects") || "[]");
    return Array.isArray(value)
      ? value
          .filter(
            (p) =>
              p &&
              typeof p.id === "string" &&
              typeof p.title === "string" &&
              typeof p.brief === "string" &&
              typeof p.createdAt === "string" &&
              typeof p.type === "string" &&
              typeof p.summary === "string" &&
              Number.isInteger(p.days) && p.days >= 6 && p.days <= 180 &&
              !Number.isNaN(Date.parse(p.createdAt)) &&
              Array.isArray(p.tasks) &&
              p.tasks.length === 6 &&
              p.tasks.every(
                (t) =>
                  t &&
                  typeof t.name === "string" &&
                  Number.isInteger(t.id) && Number.isInteger(t.dueDay) &&
                  typeof t.done === "boolean",
              ) &&
              Array.isArray(p.requirements) &&
              p.requirements.every((x) => typeof x === "string") &&
              Array.isArray(p.risks) &&
              p.risks.every((x) => typeof x === "string"),
          )
          .slice(0, 200)
      : [];
  } catch {
    return [];
  }
}
export function weekActivity(projects, now = new Date()) {
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(now);
    day.setDate(day.getDate() - 6 + i);
    return {
      label: day.toLocaleDateString("en", { weekday: "short" }),
      count: projects.filter(
        (p) => new Date(p.createdAt).toDateString() === day.toDateString(),
      ).length,
    };
  });
}
