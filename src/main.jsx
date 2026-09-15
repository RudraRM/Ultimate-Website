import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useReducedMotion,
  useInView,
  animate,
} from "framer-motion";
import {
  templates,
  generateProject,
  toMarkdown,
  readProjects,
  weekActivity,
} from "./engine";
import "./styles.css";

const paths = {
  arrow: "M5 12h14m-5-5 5 5-5 5",
  check: "m5 12 4 4L19 6",
  spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  file: "M14 3H5v18h14V8ZM14 3v5h5M8 12h8M8 16h5",
  layers: "m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5",
  chart: "M4 3v17h17M8 15l4-5 4 2 5-7",
  clock: "M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
  card: "M3 5h18v14H3ZM3 10h18M7 15h3",
  link: "m10 13 4-4M8 16l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 1 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0",
  download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  plus: "M12 5v14M5 12h14",
  close: "m6 6 12 12M6 18 18 6",
  menu: "M4 6h16M4 12h16M4 18h16",
  logout: "M9 4H4v16h5m5-13 5 5-5 5M8 12h11",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  shield: "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Zm-4 9 3 3 5-6",
  chevron: "m9 5 7 7-7 7",
  terminal: "m5 7 5 5-5 5m8 0h6",
  copy: "M8 8h13v13H8ZM16 8V3H3v13h5",
  sun: "M12 3v2m0 14v2M3 12h2m14 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
};
function Icon({ name = "spark", size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.spark} />
    </svg>
  );
}
function Logo({ onClick }) {
  return (
    <button className="logo" onClick={onClick} aria-label="Briefly home">
      <span className="brand-mark">
        b<span>·</span>
      </span>
      briefly<span className="logo-dot">.</span>
    </button>
  );
}
function Button({ children, variant = "", className = "", ...props }) {
  return (
    <button className={`button ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
function Reveal({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.45 }}
    >
      {children}
    </motion.div>
  );
}
function Counter({ value }) {
  const ref = useRef(null),
    seen = useInView(ref, { once: true }),
    reduced = useReducedMotion();
  useEffect(() => {
    if (!seen) return;
    if (reduced) {
      ref.current.textContent = value;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.2,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v);
      },
    });
    return () => controls.stop();
  }, [seen, value, reduced]);
  return <span ref={ref}>{value}</span>;
}
const features = [
  [
    "file",
    "Briefs that bring clarity",
    "Turn scattered notes into a focused scope, deliverables, and the right questions to ask.",
    ["Scope extraction", "4 project types"],
  ],
  [
    "layers",
    "A plan, without the blank page",
    "Start with six practical milestones. Set your timeline and make the plan your own.",
    ["Delivery plans", "Due-day targets"],
  ],
  [
    "check",
    "Keep every deliverable moving",
    "Track what’s complete and what’s next. A shared view of progress starts with a clear checklist.",
    ["Task tracking", "Live progress"],
  ],
  [
    "chart",
    "See the bigger picture",
    "Understand your project activity with focused charts and useful visual recommendations.",
    ["Activity trends", "Project health"],
  ],
  [
    "download",
    "Your work. Ready to go.",
    "Export a polished Markdown plan or structured JSON to use in the tools you already know.",
    ["Markdown", "JSON export"],
  ],
  [
    "shield",
    "A quieter kind of workspace",
    "Explore without connecting accounts. Your project drafts stay in this browser.",
    ["Local-first", "No API key"],
  ],
];
const plans = [
  {
    name: "Free",
    price: 0,
    tag: "For your next great idea",
    features: [
      "3 saved project plans",
      "All 4 starter templates",
      "Markdown & JSON export",
      "Community support",
    ],
    cta: "Start for free",
  },
  {
    name: "Pro",
    price: 49,
    tag: "For teams finding their rhythm",
    features: [
      "100 project plans per month",
      "Advanced workflow tools",
      "API access",
      "Priority support",
    ],
    cta: "Choose Pro",
  },
  {
    name: "Plus",
    price: 149,
    tag: "For ambitious, growing teams",
    features: [
      "Unlimited project capacity",
      "Enterprise-grade controls",
      "Team roles & workspaces",
      "Dedicated support",
    ],
    cta: "Choose Plus",
  },
];
function PlanCards({ onSelect, current }) {
  return (
    <div className="pricing-grid">
      {plans.map((p) => (
        <article
          key={p.name}
          className={`plan ${p.name === "Pro" ? "featured" : ""}`}
        >
          <div className="flex items-center justify-between">
            <h3>{p.name}</h3>
            {p.name === "Pro" && <span className="best">Best Value</span>}
          </div>
          <p>{p.tag}</p>
          <div className="price">
            ${p.price}
            <span>/month</span>
          </div>
          <Button
            variant={p.name === "Pro" ? "primary" : "secondary"}
            onClick={() => onSelect(p.name)}
          >
            {current === p.name ? "Current preview plan" : p.cta}
            <Icon name="arrow" size={17} />
          </Button>
          <ul>
            {p.features.map((f) => (
              <li key={f}>
                <Icon name="check" size={16} />
                {f}
              </li>
            ))}
          </ul>
          {p.name !== "Free" && (
            <small>Proposed subscription · preview only</small>
          )}
        </article>
      ))}
    </div>
  );
}
function MiniBoard() {
  return (
    <div className="product-preview" aria-label="Example project preview">
      <div className="preview-top">
        <span className="flex items-center gap-2">
          <span className="tiny-mark">b.</span> Your workspace{" "}
          <span className="slash">/</span> Website launch
        </span>
        <span className="badge">Example project</span>
      </div>
      <div className="preview-content">
        <div className="preview-aside">
          <div className="selected">
            <Icon name="grid" size={15} />
            Overview
          </div>
          <div>
            <Icon name="spark" size={15} />
            Feature studio
          </div>
          <div>
            <Icon name="chart" size={15} />
            Analytics
          </div>
          <div>
            <Icon name="card" size={15} />
            Billing
          </div>
          <span className="aside-caption">
            LESS ADMIN.
            <br />
            MORE GOOD WORK.
          </span>
        </div>
        <div className="preview-main">
          <div className="flex justify-between items-center">
            <div>
              <small className="eyebrow">PROJECT SNAPSHOT</small>
              <h3>A clear path to launch.</h3>
            </div>
            <span className="badge green">On track</span>
          </div>
          <div className="preview-stats">
            <div>
              <small>Deliverables</small>
              <strong>06</strong>
            </div>
            <div>
              <small>Completed</small>
              <strong>
                04<span>/ 06</span>
              </strong>
            </div>
            <div>
              <small>Timeline</small>
              <strong>
                14<span> days</span>
              </strong>
            </div>
          </div>
          <div className="flex justify-between text-xs mb-2">
            <span>Project progress</span>
            <strong>67%</strong>
          </div>
          <div className="progress">
            <span style={{ width: "67%" }} />
          </div>
          <div className="preview-task">
            <span className="check-icon">
              <Icon name="check" size={13} />
            </span>
            Design responsive page layouts <span>Done</span>
          </div>
          <div className="preview-task">
            <span className="empty-check" />
            Review accessibility & mobile layouts <span>Up next</span>
          </div>
        </div>
      </div>
      <div className="floating-note">
        <span>
          <Icon name="check" size={16} />
        </span>
        <div>
          <strong>Clarity, built in.</strong>
          <small>From the first brief to the final handoff.</small>
        </div>
      </div>
    </div>
  );
}
function Landing({ start, openInfo }) {
  const [menu, setMenu] = useState(false),
    [prompt, setPrompt] = useState("");
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container nav">
          <Logo
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
          <nav
            className={menu ? "nav-links open" : "nav-links"}
            aria-label="Main navigation"
          >
            {[
              ["Features", "features"],
              ["How it works", "how-it-works"],
              ["Pricing", "pricing"],
            ].map(([label, id]) => (
              <a key={id} href={"#" + id} onClick={() => setMenu(false)}>
                {label}
              </a>
            ))}
            <button className="mobile-login" onClick={() => start()}>
              Log in
            </button>
          </nav>
          <div className="flex items-center gap-6">
            <button className="login-link" onClick={() => start()}>
              Log in
            </button>
            <Button variant="primary small" onClick={() => start()}>
              Get started <Icon name="arrow" size={16} />
            </Button>
            <button
              className="menu-toggle"
              aria-label="Toggle navigation"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              <Icon name={menu ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <section className="hero container">
          <Reveal>
            <div className="announcement">
              <span className="status-dot" /> A little less busy. A lot more
              productive.
              <Icon name="arrow" size={13} />
            </div>
            <h1>
              From brief to
              <br />
              <span>brilliant.</span>
            </h1>
            <p className="hero-description">
              Turn scattered client requests into clear, actionable project
              plans.
              <br className="desktop-break" /> Your best work starts with a
              little clarity.
            </p>
            <form
              className="prompt-bar"
              onSubmit={(e) => {
                e.preventDefault();
                start("Free", prompt);
              }}
            >
              <span className="prompt-icon">
                <Icon name="terminal" />
              </span>
              <label htmlFor="hero-prompt" className="sr-only">
                Describe your next project
              </label>
              <input
                id="hero-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={8000}
                placeholder="A website launch for a sustainable brand..."
              />
              <span className="cursor" />
              <button aria-label="Start with this brief">
                <Icon name="arrow" size={20} />
              </button>
            </form>
            <div className="hero-actions">
              <Button variant="primary" onClick={() => start()}>
                Create your first project <Icon name="arrow" size={17} />
              </Button>
              <a className="text-link" href="#how-it-works">
                See how it works <span>↗</span>
              </a>
            </div>
            <p className="hero-fine">
              <Icon name="check" size={13} /> Free to explore <span>·</span> No
              credit card required
            </p>
            <div className="stat-row">
              {[
                [6, "Core features"],
                [4, "Project templates"],
                [2, "Export formats"],
              ].map(([v, label]) => (
                <div key={label}>
                  <strong>
                    <Counter value={v} />
                    <span>+</span>
                  </strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="preview-wrap">
            <MiniBoard />
          </Reveal>
          <div className="audience-line">
            A calmer workflow for <span>independent studios</span>
            <i /> <span>creative agencies</span>
            <i />
            <span>ambitious freelancers</span>
          </div>
        </section>
        <section id="features" className="section container">
          <Reveal className="section-heading">
            <span className="eyebrow">BIG IDEAS. LESS BUSYWORK.</span>
            <h2>
              Everything you need.
              <br />
              <span>Nothing in your way.</span>
            </h2>
            <p>
              From the first “what if” to the final handoff.
              <br />A thoughtfully connected toolkit for client work.
            </p>
          </Reveal>
          <div className="feature-grid">
            {features.map(([icon, title, desc, tags], i) => (
              <Reveal key={title}>
                <article className="feature-card">
                  <div className={"feature-icon shade-" + i}>
                    <Icon name={icon} size={23} />
                  </div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <div className="tags">
                    {tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
        <section id="toolkit" className="stack-section">
          <div className="container stack-layout">
            <Reveal>
              <span className="eyebrow">FITS RIGHT INTO YOUR FLOW</span>
              <h2>
                Good company.
                <br />
                <span>Great compatibility.</span>
              </h2>
              <p>
                Portable formats. Familiar technology.
                <br />A foundation built for your next chapter.
              </p>
              <span className="stack-note">
                <Icon name="link" size={15} /> Export today. Connect more as you
                grow.
              </span>
            </Reveal>
            <div className="stack-grid">
              {[
                ["React", "Interactive workspace", "R"],
                ["Tailwind CSS", "Responsive by design", "~"],
                ["Framer Motion", "Thoughtful movement", "M"],
                ["Markdown", "Readable project exports", "#"],
                ["JSON", "Structured project data", "{}"],
                ["Browser storage", "Drafts on this device", "◎"],
              ].map(([name, desc, mark]) => (
                <div className="stack-item" key={name}>
                  <span className="tech-mark">{mark}</span>
                  <div>
                    <strong>{name}</strong>
                    <small>{desc}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="how-it-works" className="section container">
          <Reveal className="section-heading">
            <span className="eyebrow">FROM THE MESSY MIDDLE TO DONE</span>
            <h2>
              Six small steps.
              <br />
              <span>One giant sigh of relief.</span>
            </h2>
            <p>A repeatable process, without the process overload.</p>
          </Reveal>
          <div className="steps-grid">
            {[
              [
                "Bring your brief",
                "Paste your client’s notes, goals, and requirements.",
              ],
              [
                "Set the direction",
                "Choose a project type and a realistic timeline.",
              ],
              [
                "Find the scope",
                "Pull key requirements into a focused overview.",
              ],
              [
                "Build the plan",
                "Get six suggested milestones with delivery targets.",
              ],
              [
                "Make it yours",
                "Review open questions and track each deliverable.",
              ],
              [
                "Move work forward",
                "Export your plan and bring it into your workflow.",
              ],
            ].map(([title, desc], i) => (
              <Reveal className="step" key={title}>
                <span className="step-number">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </Reveal>
            ))}
          </div>
          <div className="center-cta">
            <Button variant="secondary" onClick={() => start()}>
              Let’s make something clear <Icon name="arrow" size={17} />
            </Button>
          </div>
        </section>
        <section id="pricing" className="pricing-section">
          <div className="container">
            <Reveal className="section-heading">
              <span className="eyebrow">ROOM TO GROW</span>
              <h2>
                Small start.<span> Big possibilities.</span>
              </h2>
              <p>Start free. Find the right fit as your work grows.</p>
              <span className="preview-disclaimer">
                Frontend preview · paid plans are not yet available
              </span>
            </Reveal>
            <PlanCards onSelect={start} />
            <p className="pricing-note">
              <Icon name="shield" size={15} /> No charges in this preview. Paid
              features describe the planned product.
            </p>
          </div>
        </section>
      </main>
      <footer className="container footer">
        <div className="footer-grid">
          <div>
            <Logo
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />
            <p>
              A little clarity.
              <br />A lot of possibility.
            </p>
            <span className="footer-status">
              <span className="status-dot" /> Built for better work
            </span>
          </div>
          <div>
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
            <button onClick={() => start()}>Workspace</button>
          </div>
          <div>
            <h4>Resources</h4>
            <button onClick={() => openInfo("Getting started")}>
              Getting started
            </button>
            <button onClick={() => openInfo("Templates")}>
              Template directory
            </button>
            <button onClick={() => openInfo("Export guide")}>
              Export guide
            </button>
          </div>
          <div>
            <h4>Ecosystem</h4>
            <a href="https://react.dev" target="_blank" rel="noreferrer">
              React ↗
            </a>
            <a href="https://motion.dev" target="_blank" rel="noreferrer">
              Motion ↗
            </a>
            <a
              href="https://github.com/RudraRM/Ultimate-Website"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Briefly. Made for what’s next.
          </span>
          <div>
            <button onClick={() => openInfo("Privacy")}>Privacy</button>
            <button onClick={() => openInfo("Terms")}>Terms</button>
            <button onClick={() => openInfo("Refund policy")}>
              Refund policy
            </button>
          </div>
          <span className="footer-sign">Less noise. More signal.</span>
        </div>
      </footer>
    </>
  );
}
function Modal({ title, children, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    d.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="modal-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-header">
        <h2 id="modal-title">{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
const info = {
  "Getting started": [
    "Open the workspace with a display name. This is a simulated sign-in; no account is created.",
    "In Feature Studio, choose one of four project types, add your brief, and generate a plan.",
    "Check completed tasks in Main Board. Export your plan from the project card or Analytics / History.",
  ],
  Templates: [
    "Website launch: sitemap, wireframes, design, build, review, and launch.",
    "Brand identity: positioning, visual directions, identity system, guidelines, exports, and handoff.",
    "Content campaign: audience, calendar, content, review, assets, and delivery.",
    "Product design: problem, journey, wireframes, prototype, testing, and handoff.",
  ],
  "Export guide": [
    "Markdown exports include the original brief, extracted scope, task checklist, and open questions. Open them in any text editor or a Markdown-friendly workspace.",
    "JSON exports preserve your project data for future integrations. No external service is connected or sent your data.",
  ],
  Privacy: [
    "This frontend stores project drafts and the selected preview plan in localStorage on this browser. Your display name is stored for this browser tab session.",
    "Briefly does not send your briefs to an AI service or create a server account. Anyone with access to this browser profile can access its locally stored projects.",
    "You can delete all project data in Account Billing. Export anything you want to keep first. Your hosting provider may collect normal access logs under its own policy.",
  ],
  Terms: [
    "Briefly is a frontend product preview, provided as-is for evaluation. Simulated sign-in does not protect sensitive information.",
    "Generated plans use local templates and simple text extraction, not an AI model. Review scope, accuracy, and deadlines before relying on them.",
    "Displayed paid features are planned, not active. This preview does not create subscriptions or process payments.",
  ],
  "Refund policy": [
    "No payments are collected in this preview, so there are no purchases to refund.",
    "A complete billing and refund policy must be published before enabling paid subscriptions.",
  ],
};
function ActivityChart({ projects }) {
  const [type, setType] = useState("bar");
  const data = weekActivity(projects),
    max = Math.max(3, ...data.map((d) => d.count)),
    points = data
      .map((d, i) => `${52 + i * 63},${164 - (d.count / max) * 125}`)
      .join(" ");
  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <h3>Project activity</h3>
          <p>Plans created over the last 7 days</p>
        </div>
        <div className="segmented" aria-label="Chart style">
          {["bar", "line"].map((t) => (
            <button
              key={t}
              aria-pressed={type === t}
              className={type === t ? "active" : ""}
              onClick={() => setType(t)}
            >
              {t === "bar" ? "Bar" : "Line"}
            </button>
          ))}
        </div>
      </div>
      <svg
        className="activity-chart"
        viewBox="0 0 490 205"
        role="img"
        aria-label={`Projects created: ${data.map((d) => d.label + " " + d.count).join(", ")}`}
      >
        <title>Plans created in the last seven days</title>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line
              x1="30"
              x2="470"
              y1={164 - (i * 125) / 3}
              y2={164 - (i * 125) / 3}
              stroke="#e7ece8"
              strokeDasharray="3 4"
            />
            <text x="12" y={168 - (i * 125) / 3} fill="#7d8881" fontSize="10">
              {Math.round((max * i) / 3)}
            </text>
          </g>
        ))}
        {type === "bar" ? (
          data.map((d, i) => (
            <rect
              key={i}
              x={37 + i * 63}
              y={164 - (d.count / max) * 125}
              width="30"
              height={Math.max(2, (d.count / max) * 125)}
              rx="5"
              fill={i === 6 ? "#285d49" : "#b8cdbd"}
            >
              <title>
                {d.label}: {d.count} plans
              </title>
            </rect>
          ))
        ) : (
          <>
            <polyline
              points={points}
              fill="none"
              stroke="#285d49"
              strokeWidth="3"
            />
            {data.map((d, i) => (
              <circle
                key={i}
                cx={52 + i * 63}
                cy={164 - (d.count / max) * 125}
                r="4"
                fill="#285d49"
              >
                <title>
                  {d.label}: {d.count} plans
                </title>
              </circle>
            ))}
          </>
        )}
        {data.map((d, i) => (
          <text
            key={i}
            x={52 + i * 63}
            y="193"
            textAnchor="middle"
            fill="#7d8881"
            fontSize="11"
          >
            {d.label}
          </text>
        ))}
      </svg>
      <div className="chart-insight">
        <Icon name="spark" size={16} />
        {type === "bar"
          ? "Recommended for comparing daily project volume."
          : "Use a line chart to spot changes over time."}
      </div>
    </div>
  );
}
function download(project, format) {
  const text =
    format === "json" ? JSON.stringify(project, null, 2) : toMarkdown(project);
  const url = URL.createObjectURL(
    new Blob([text], {
      type:
        format === "json" ? "application/json" : "text/markdown;charset=utf-8",
    }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download =
    (project.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "project") +
    "." +
    (format === "json" ? "json" : "md");
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function ProjectCard({ project, toggle, exportProject }) {
  const done = project.tasks.filter((t) => t.done).length,
    pct = Math.round((done / project.tasks.length) * 100);
  return (
    <article className="panel project-card">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">
            {project.type} · {project.days} DAYS
          </span>
          <h3>{project.title}</h3>
        </div>
        <span className={"badge " + (pct === 100 ? "green" : "")}>
          {pct === 100 ? "Complete" : "In progress"}
        </span>
      </div>
      <p className="project-summary">{project.summary}</p>
      <div className="flex justify-between text-xs mb-2">
        <span>
          {done} of {project.tasks.length} deliverables
        </span>
        <strong>{pct}%</strong>
      </div>
      <div className="progress mb-5">
        <span style={{ width: pct + "%" }} />
      </div>
      <div className="task-list">
        {project.tasks.map((t) => (
          <label key={t.id} className={t.done ? "task complete" : "task"}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggle(project.id, t.id)}
            />
            <span>{t.name}</span>
            <small>Day {t.dueDay}</small>
          </label>
        ))}
      </div>
      {project.risks.length > 0 && (
        <details className="questions">
          <summary>{project.risks.length} questions to resolve</summary>
          <ul>
            {project.risks.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </details>
      )}
      <div className="project-actions">
        <Button
          variant="secondary small"
          onClick={() => exportProject(project, "md")}
        >
          <Icon name="download" size={15} />
          Export Markdown
        </Button>
        <button
          className="text-link"
          onClick={() => exportProject(project, "json")}
        >
          JSON <Icon name="arrow" size={14} />
        </button>
      </div>
    </article>
  );
}
function Studio({ onCreate, seed, plan, count }) {
  const [title, setTitle] = useState(""),
    [brief, setBrief] = useState(seed || ""),
    [type, setType] = useState("Website launch"),
    [days, setDays] = useState(14),
    [error, setError] = useState("");
  function submit(e) {
    e.preventDefault();
    try {
      if (plan === "Free" && count >= 3)
        throw new Error(
          "Your Free preview has 3 saved projects. Choose another preview plan in Account Billing or clear your saved data.",
        );
      if (count >= 200)
        throw new Error(
          "This frontend preview is limited to 200 local projects. Export and clear your data to continue.",
        );
      onCreate(generateProject({ title, brief, type, days }));
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <div className="studio-layout">
      <form className="panel studio-form" onSubmit={submit}>
        <div className="panel-heading">
          <div>
            <h3>Start with the messy version.</h3>
            <p>We’ll help you find the structure.</p>
          </div>
          <span className="feature-icon">
            <Icon name="spark" />
          </span>
        </div>
        <label htmlFor="project-title">Project name</label>
        <input
          id="project-title"
          placeholder="e.g. Evergreen website launch"
          maxLength={100}
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="form-row">
          <div>
            <label htmlFor="project-type">Project type</label>
            <select
              id="project-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {Object.keys(templates).map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="project-days">Timeline (days)</label>
            <input
              id="project-days"
              type="number"
              min="6"
              max="180"
              required
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <label htmlFor="project-brief">The client brief</label>
          <button
            type="button"
            className="text-link small"
            onClick={() => {
              setTitle("Evergreen website launch");
              setType("Website launch");
              setDays(14);
              setBrief(
                "Create a new website for Evergreen, a sustainable homeware brand. Our audience is design-conscious customers who value natural materials. We need a homepage, product collection page, and an about page. Include responsive designs and an accessible contact form. The client founder will approve the final designs. Budget: $4,000.",
              );
            }}
          >
            Use an example <Icon name="arrow" size={13} />
          </button>
        </div>
        <textarea
          id="project-brief"
          rows="8"
          required
          minLength={30}
          maxLength={8000}
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="Tell us about the project, audience, goals, and what needs to be delivered..."
        />
        <div className="field-hint">
          <span>At least 30 characters. More context, a clearer plan.</span>
          <span>{brief.length}/8,000</span>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <Button variant="primary" type="submit">
          Create project plan <Icon name="spark" size={17} />
        </Button>
        <p className="form-footnote">
          <Icon name="shield" size={14} />
          Built locally from structured templates. Review before sharing.
        </p>
      </form>
      <aside>
        <div className="studio-note">
          <span className="eyebrow">A BETTER BRIEF STARTS HERE</span>
          <h3>
            A little context
            <br />
            goes a long way.
          </h3>
          <p>The most useful briefs answer a few simple questions.</p>
          {[
            [
              "01",
              "What are we making?",
              "List the deliverables and boundaries.",
            ],
            ["02", "Who is it for?", "Describe the audience and their goal."],
            [
              "03",
              "What does done look like?",
              "Define success, budget, and approval.",
            ],
          ].map(([n, h, d]) => (
            <div className="note-step" key={n}>
              <span>{n}</span>
              <div>
                <strong>{h}</strong>
                <p>{d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="local-notice">
          <Icon name="shield" size={18} />
          <p>
            Your drafts stay on this device. Export important work before
            clearing browser data.
          </p>
        </div>
      </aside>
    </div>
  );
}
const navItems = [
  ["overview", "grid", "Main Board"],
  ["studio", "spark", "Feature Studio"],
  ["history", "clock", "Analytics / History"],
  ["billing", "card", "Account Billing"],
];
function Dashboard({
  user,
  logout,
  home,
  projects,
  setProjects,
  plan,
  setPlan,
  initialTab,
  seed,
  notify,
}) {
  const [tab, setTab] = useState(initialTab),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("All projects"),
    [selected, setSelected] = useState(null),
    [confirm, setConfirm] = useState(null),
    [menu, setMenu] = useState(false);
  const done = projects.reduce(
      (s, p) => s + p.tasks.filter((t) => t.done).length,
      0,
    ),
    tasks = projects.reduce((s, p) => s + p.tasks.length, 0);
  const active = projects.filter((p) => p.tasks.some((t) => !t.done)).length;
  const toggle = (id, taskId) =>
    setProjects(
      projects.map((p) =>
        p.id === id
          ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId ? { ...t, done: !t.done } : t,
              ),
            }
          : p,
      ),
    );
  const exportProject = (p, f) => {
    download(p, f);
    notify("Project exported as " + (f === "md" ? "Markdown" : "JSON"));
  };
  function go(t) {
    setTab(t);
    setMenu(false);
    window.scrollTo(0, 0);
  }
  const heading = {
    overview: [
      "A little clarity for your day.",
      "Your projects, progress, and next steps. All in one place.",
    ],
    studio: [
      "Good work starts here.",
      "Turn your next client brief into a practical delivery plan.",
    ],
    history: [
      "Every project has a story.",
      "Find your plans, review progress, and export your work.",
    ],
    billing: [
      "Your workspace. Your pace.",
      "Manage your profile and explore the right plan.",
    ],
  }[tab];
  return (
    <div className="dashboard">
      <aside className={"sidebar " + (menu ? "is-open" : "")}>
        <Logo onClick={home} />
        <div className="workspace-switch">
          <span className="workspace-avatar">
            {user.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <strong>{user}’s workspace</strong>
            <small>Local preview</small>
          </div>
        </div>
        <span className="nav-caption">WORKSPACE</span>
        <nav aria-label="Workspace navigation">
          {navItems.map(([id, icon, label]) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={tab === id ? "active" : ""}
              aria-current={tab === id ? "page" : undefined}
            >
              <Icon name={icon} size={19} />
              {label}
              {id === "studio" && <span className="new-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="plan-callout">
            <span className="flex justify-between">
              <strong>{plan} preview</strong>
              <Icon name="spark" size={15} />
            </span>
            <p>
              {projects.length} project{projects.length === 1 ? "" : "s"} saved
              on this device
            </p>
            <button onClick={() => go("billing")}>
              Explore plans <Icon name="arrow" size={14} />
            </button>
          </div>
          <button className="user-menu" onClick={logout}>
            <span className="user-avatar">
              {user.slice(0, 1).toUpperCase()}
            </span>
            <span>
              {user}
              <small>Sign out of preview</small>
            </span>
            <Icon name="logout" size={17} />
          </button>
        </div>
      </aside>
      <div className="workspace-main">
        <header className="workspace-header">
          <div className="flex items-center gap-3">
            <button
              className="menu-toggle"
              aria-label="Toggle workspace navigation"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              <Icon name={menu ? "close" : "menu"} />
            </button>
            <span>
              Workspace <span className="slash">/</span>{" "}
              <strong>{navItems.find((n) => n[0] === tab)[2]}</strong>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="preview-label">
              <span className="status-dot" /> Frontend preview
            </span>
            <button
              className="icon-button"
              onClick={home}
              aria-label="Back to landing page"
            >
              <Icon name="logout" size={18} />
            </button>
          </div>
        </header>
        <main className="dashboard-content">
          <div className="dashboard-heading">
            <div>
              <span className="eyebrow">
                {tab === "overview"
                  ? "LET’S MAKE ROOM FOR GOOD WORK"
                  : "YOUR BRIEFLY WORKSPACE"}
              </span>
              <h1>{heading[0]}</h1>
              <p>{heading[1]}</p>
            </div>
            {tab !== "studio" && (
              <Button variant="primary" onClick={() => go("studio")}>
                <Icon name="plus" size={17} />
                New project
              </Button>
            )}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {tab === "overview" && (
                <>
                  <div className="dashboard-stats">
                    {[
                      [projects.length, "Total projects", "file"],
                      [active, "In progress", "layers"],
                      [done, "Tasks completed", "check"],
                      [
                        tasks ? Math.round((done / tasks) * 100) + "%" : "0%",
                        "Overall progress",
                        "chart",
                      ],
                    ].map(([v, label, icon]) => (
                      <div className="metric" key={label}>
                        <div className="flex justify-between">
                          <span>{label}</span>
                          <Icon name={icon} size={18} />
                        </div>
                        <strong>{v}</strong>
                        <small>
                          {label === "Overall progress"
                            ? "Across your saved plans"
                            : "From your local workspace"}
                        </small>
                      </div>
                    ))}
                  </div>
                  <div className="overview-grid">
                    <ActivityChart projects={projects} />
                    <div className="control-panel">
                      <span className="eyebrow">YOUR NEXT MOVE</span>
                      <h3>
                        Less planning.
                        <br />
                        More possibility.
                      </h3>
                      <p>
                        Bring your client’s next big idea.
                        <br />
                        Leave with a clear way forward.
                      </p>
                      <Button variant="primary" onClick={() => go("studio")}>
                        Open Feature Studio <Icon name="arrow" size={17} />
                      </Button>
                      <div className="control-foot">
                        <Icon name="file" size={16} />4 templates. One fresh
                        start.
                      </div>
                    </div>
                  </div>
                  <div className="list-heading">
                    <h2>
                      Your projects <span>{projects.length}</span>
                    </h2>
                    {projects.length > 0 && (
                      <button
                        className="text-link"
                        onClick={() => go("history")}
                      >
                        View all <Icon name="arrow" size={16} />
                      </button>
                    )}
                  </div>
                  {projects.length ? (
                    <div className="project-grid">
                      {projects.slice(0, 4).map((p) => (
                        <ProjectCard
                          key={p.id}
                          project={p}
                          toggle={toggle}
                          exportProject={exportProject}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="feature-icon">
                        <Icon name="file" size={24} />
                      </div>
                      <h3>Your next great project starts here.</h3>
                      <p>
                        Create your first plan to see progress and activity.
                      </p>
                      <Button variant="secondary" onClick={() => go("studio")}>
                        Create a project <Icon name="plus" size={16} />
                      </Button>
                    </div>
                  )}
                </>
              )}
              {tab === "studio" && (
                <Studio
                  seed={seed}
                  plan={plan}
                  count={projects.length}
                  onCreate={(p) => {
                    setProjects([p, ...projects]);
                    go("overview");
                    notify("Project plan created. Your next steps are ready.");
                  }}
                />
              )}
              {tab === "history" && (
                <>
                  <div className="history-toolbar">
                    <div className="search-field">
                      <Icon name="search" size={18} />
                      <input
                        aria-label="Search projects"
                        placeholder="Search projects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <select
                      aria-label="Filter project status"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option>All projects</option>
                      <option>In progress</option>
                      <option>Complete</option>
                    </select>
                  </div>
                  <div className="panel table-panel">
                    <div className="table-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th>Project</th>
                            <th>Created</th>
                            <th>Progress</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects
                            .filter(
                              (p) =>
                                p.title
                                  .toLowerCase()
                                  .includes(search.toLowerCase()) &&
                                (filter === "All projects" ||
                                  (p.tasks.every((t) => t.done)
                                    ? "Complete"
                                    : "In progress") === filter),
                            )
                            .map((p) => {
                              const completed = p.tasks.filter(
                                (t) => t.done,
                              ).length;
                              return (
                                <tr key={p.id}>
                                  <td>
                                    <button
                                      className="project-name"
                                      onClick={() => setSelected(p.id)}
                                    >
                                      {p.title}
                                    </button>
                                    <small>{p.type}</small>
                                  </td>
                                  <td>
                                    {new Date(p.createdAt).toLocaleDateString()}
                                  </td>
                                  <td>
                                    {completed}/{p.tasks.length} tasks
                                  </td>
                                  <td>
                                    <span
                                      className={
                                        "badge " +
                                        (completed === p.tasks.length
                                          ? "green"
                                          : "")
                                      }
                                    >
                                      {completed === p.tasks.length
                                        ? "Complete"
                                        : "In progress"}
                                    </span>
                                  </td>
                                  <td>
                                    <button
                                      className="icon-button"
                                      aria-label={"Export " + p.title}
                                      onClick={() => exportProject(p, "md")}
                                    >
                                      <Icon name="download" size={18} />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                    {!projects.some(
                      (p) =>
                        p.title.toLowerCase().includes(search.toLowerCase()) &&
                        (filter === "All projects" ||
                          (p.tasks.every((t) => t.done)
                            ? "Complete"
                            : "In progress") === filter),
                    ) && (
                      <div className="empty-state compact">
                        <Icon name="search" size={25} />
                        <h3>No projects found.</h3>
                        <p>
                          {projects.length
                            ? "Try another search or filter."
                            : "Create a plan in Feature Studio to begin."}
                        </p>
                      </div>
                    )}
                  </div>
                  <ActivityChart projects={projects} />
                </>
              )}
              {tab === "billing" && (
                <>
                  <div className="account-summary panel">
                    <span className="workspace-avatar large">
                      {user.slice(0, 1).toUpperCase()}
                    </span>
                    <div>
                      <h3>{user}’s workspace</h3>
                      <p>
                        {plan} plan preview · {projects.length} local projects
                      </p>
                    </div>
                    <span className="badge green">No active subscription</span>
                  </div>
                  <div className="billing-notice">
                    <Icon name="card" />
                    <div>
                      <strong>Explore the plans. No payment required.</strong>
                      <p>
                        Plan selection is simulated. API access, team controls,
                        and support services are planned features, not enabled
                        in this frontend.
                      </p>
                    </div>
                  </div>
                  <PlanCards
                    current={plan}
                    onSelect={(p) => setConfirm({ type: "plan", plan: p })}
                  />
                  <div className="panel data-settings">
                    <div>
                      <h3>Local workspace data</h3>
                      <p>
                        Delete all saved projects from this browser. Export your
                        work first.
                      </p>
                    </div>
                    <Button
                      variant="danger small"
                      onClick={() => setConfirm({ type: "delete" })}
                      disabled={!projects.length}
                    >
                      Delete project data
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="dashboard-footer">
            <span>
              <span className="status-dot" /> Saved on this device
            </span>
            <span>Made for clearer days.</span>
          </div>
        </main>
      </div>
      {selected && projects.find((p) => p.id === selected) && (
        <Modal title="Project details" onClose={() => setSelected(null)}>
          <ProjectCard
            project={projects.find((p) => p.id === selected)}
            toggle={toggle}
            exportProject={exportProject}
          />
        </Modal>
      )}
      {confirm && (
        <Modal
          title={
            confirm.type === "plan"
              ? "Preview " + confirm.plan
              : "Delete all project data?"
          }
          onClose={() => setConfirm(null)}
        >
          <p className="modal-copy">
            {confirm.type === "plan"
              ? "This changes your preview plan only. No payment will be collected and no subscription will be created. Paid service features remain unavailable."
              : "This permanently removes all saved projects from this browser. Download any project exports you need before continuing."}
          </p>
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant={confirm.type === "plan" ? "primary" : "danger"}
              onClick={() => {
                if (confirm.type === "plan") {
                  setPlan(confirm.plan);
                  notify(confirm.plan + " preview selected. No charges.");
                } else {
                  setProjects([]);
                  notify("All local projects deleted.");
                }
                setConfirm(null);
              }}
            >
              {confirm.type === "plan"
                ? "Use preview plan"
                : "Delete all projects"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
function App() {
  const [user, setUser] = useState(() => {
      try {
        return sessionStorage.getItem("briefly.user") || "";
      } catch {
        return "";
      }
    }),
    [view, setView] = useState("landing"),
    [login, setLogin] = useState(null),
    [name, setName] = useState(""),
    [infoTitle, setInfoTitle] = useState(null),
    [projects, setProjects] = useState(() => {
      try {
        return readProjects(localStorage);
      } catch {
        return [];
      }
    }),
    [plan, setPlan] = useState(() => {
      try {
        const p = localStorage.getItem("briefly.plan");
        return plans.some((x) => x.name === p) ? p : "Free";
      } catch {
        return "Free";
      }
    }),
    [toast, setToast] = useState(""),
    [seed, setSeed] = useState(""),
    [initialTab, setInitialTab] = useState("overview");
  const timer = useRef(null);
  function notify(s) {
    setToast(s);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 4000);
  }
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    try {
      localStorage.setItem("briefly.projects", JSON.stringify(projects));
    } catch {
      notify(
        "Browser storage is unavailable or full. Export your projects before leaving.",
      );
    }
  }, [projects]);
  useEffect(() => {
    try {
      localStorage.setItem("briefly.plan", plan);
    } catch {}
  }, [plan]);
  function start(selected = "Free", prompt = "") {
    setSeed(prompt);
    setInitialTab(
      prompt ? "studio" : selected === "Free" ? "overview" : "billing",
    );
    if (user) {
      setView("dashboard");
      if (selected !== "Free")
        notify("Compare proposed plans in Account Billing.");
    } else setLogin({ selected, prompt });
    window.scrollTo(0, 0);
  }
  return (
    <MotionConfig reducedMotion="user">
      {view === "landing" ? (
        <Landing start={start} openInfo={setInfoTitle} />
      ) : (
        <Dashboard
          key={user}
          user={user}
          home={() => {
            setView("landing");
            window.scrollTo(0, 0);
          }}
          logout={() => {
            setUser("");
            try {
              sessionStorage.removeItem("briefly.user");
            } catch {}
            setView("landing");
            notify("Signed out of preview. Projects remain on this device.");
          }}
          projects={projects}
          setProjects={setProjects}
          plan={plan}
          setPlan={setPlan}
          seed={seed}
          initialTab={initialTab}
          notify={notify}
        />
      )}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Icon name="check" size={18} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      {login && (
        <Modal title="Make room for good work." onClose={() => setLogin(null)}>
          <p className="modal-copy">
            Welcome to your Briefly workspace. Choose a display name to explore.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = name.trim();
              if (!n) return;
              setUser(n);
              try {
                sessionStorage.setItem("briefly.user", n);
              } catch {}
              setLogin(null);
              setView("dashboard");
              window.scrollTo(0, 0);
            }}
          >
            <label htmlFor="display-name">Your display name</label>
            <input
              id="display-name"
              autoFocus
              required
              maxLength={40}
              pattern=".*\S.*"
              placeholder="e.g. Alex"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button variant="primary full" type="submit">
              Enter preview workspace <Icon name="arrow" size={17} />
            </Button>
          </form>
          <p className="form-footnote">
            Simulated sign-in. No account, password, or secure authentication.
            Projects are stored only in this browser.
          </p>
        </Modal>
      )}
      {infoTitle && (
        <Modal title={infoTitle} onClose={() => setInfoTitle(null)}>
          <div className="info-copy">
            {info[infoTitle].map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Modal>
      )}
    </MotionConfig>
  );
}
createRoot(document.getElementById("root")).render(<App />);
