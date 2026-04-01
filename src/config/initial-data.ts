import type { CanvasNode } from "@/types/canvas";
import type { ColorLabels } from "@/hooks/use-canvas-storage";
import { NODE_COLORS } from "./constants";

const COL = { olympus: 0, wisdom: 500, war: 1000, diplomacy: 1500 };
const ROW = { r0: 0, r1: 220, r2: 440, r3: 680, r4: 1000 };

export const initialNodes: CanvasNode[] = [
  // ── Column 1 — Amber: The Grand Question ──────────────────────
  {
    id: "myth-goal",
    type: "goalCard",
    position: { x: COL.olympus, y: ROW.r0 },
    data: {
      title: "Decide the fate of Olympus",
      successCriteria: "A unified strategy that preserves divine order while addressing the Titan threat",
      timeframe: "Before the next solstice",
      priority: "high" as const,
      color: NODE_COLORS.goalCard,
    },
  },
  {
    id: "myth-prophecy",
    type: "conceptCard",
    position: { x: COL.olympus, y: ROW.r1 },
    data: {
      title: "The Prophecy of the Oracle",
      description: "The Oracle at Delphi has spoken: 'When the old ones stir beneath the earth, only unity or ruin awaits the sky-dwellers.' The prophecy is ambiguous — unity could mean alliance with the Titans, or among the gods themselves.",
      tags: ["prophecy", "oracle", "catalyst"],
      color: NODE_COLORS.goalCard,
    },
  },
  {
    id: "myth-perp-trust",
    type: "perplexityCard",
    position: { x: COL.olympus, y: ROW.r2 },
    data: {
      question: "Can the Olympians truly set aside their rivalries to face a common enemy?",
      context: "Zeus and Poseidon have feuded for centuries. Ares acts unpredictably. Athena and Ares despise each other.",
      isBlocking: true,
      color: NODE_COLORS.goalCard,
    },
  },
  {
    id: "myth-zeus",
    type: "digitalTwin",
    position: { x: COL.olympus, y: ROW.r3 },
    data: {
      name: "Zeus",
      mode: "provoca" as const,
      personality: "King of the Gods. Speaks with thunderous authority and radical boldness. Pushes every idea to its most extreme consequence. Questions whether the old rules still apply. Prone to dramatic declarations.",
      lastResponse: "",
      status: "idle" as const,
      color: NODE_COLORS.goalCard,
    },
  },
  {
    id: "myth-hera",
    type: "digitalTwin",
    position: { x: COL.olympus, y: ROW.r4 },
    data: {
      name: "Hera",
      mode: "analizza" as const,
      personality: "Queen of the Gods. Sees through deception and ego. Analyzes power dynamics with cold clarity. While others speak of glory, she asks: who benefits? Who pays the price? Fiercely protective of divine order.",
      lastResponse: "",
      status: "idle" as const,
      color: NODE_COLORS.goalCard,
    },
  },

  // ── Column 2 — Purple: Wisdom & Strategy ──────────────────────
  {
    id: "myth-alliance",
    type: "conceptCard",
    position: { x: COL.wisdom, y: ROW.r0 },
    data: {
      title: "Strategic Alliance of the Twelve",
      description: "Unite all Olympians under a war council. Pool divine powers into a combined aegis. Requires each god to sacrifice some autonomy — a bitter pill for immortals used to sovereignty.",
      tags: ["strategy", "unity", "sacrifice"],
      color: NODE_COLORS.conceptCard,
    },
  },
  {
    id: "myth-mortal-heroes",
    type: "conceptCard",
    position: { x: COL.wisdom, y: ROW.r1 },
    data: {
      title: "Empower Mortal Champions",
      description: "Select demigods and heroes (Heracles, Perseus, Achilles' legacy) as the front line. Gods provide blessings but stay above the fray. Risks: mortals are fragile, and Titans may see this as weakness.",
      tags: ["demigods", "heroes", "indirect"],
      color: NODE_COLORS.conceptCard,
    },
  },
  {
    id: "myth-perp-prometheus",
    type: "perplexityCard",
    position: { x: COL.wisdom, y: ROW.r2 },
    data: {
      question: "What does Prometheus truly know? Is his warning genuine or a Titan stratagem?",
      context: "Prometheus aided humanity against Zeus before. His loyalties are complex — he may be playing both sides.",
      isBlocking: false,
      color: NODE_COLORS.conceptCard,
    },
  },
  {
    id: "myth-athena",
    type: "digitalTwin",
    position: { x: COL.wisdom, y: ROW.r3 },
    data: {
      name: "Athena",
      mode: "analizza" as const,
      personality: "Goddess of Wisdom and Strategic Warfare. Dissects every plan with surgical precision. Finds logical gaps, questions assumptions, weighs costs. Speaks calmly but devastatingly. Never lets emotion cloud analysis.",
      lastResponse: "",
      status: "idle" as const,
      color: NODE_COLORS.conceptCard,
    },
  },

  // ── Column 3 — Rose: War & Conflict ───────────────────────────
  {
    id: "myth-strike",
    type: "conceptCard",
    position: { x: COL.war, y: ROW.r0 },
    data: {
      title: "Preemptive Strike on Tartarus",
      description: "Launch a divine assault before Kronos fully awakens. Breach the gates of Tartarus, scatter the Titans before they organize. High risk: fighting on enemy ground, and the Underworld obeys its own rules.",
      tags: ["attack", "risk", "preemptive"],
      color: NODE_COLORS.perplexityCard,
    },
  },
  {
    id: "myth-perp-ares",
    type: "perplexityCard",
    position: { x: COL.war, y: ROW.r1 },
    data: {
      question: "What if Ares, seduced by the thrill of endless war, switches sides to the Titans?",
      context: "Ares craves battle above all. If the Titans promise eternal conflict, his loyalty to Olympus may waver.",
      isBlocking: true,
      color: NODE_COLORS.perplexityCard,
    },
  },
  {
    id: "myth-weapons",
    type: "text",
    position: { x: COL.war, y: ROW.r2 },
    data: {
      text: "Ancient weapons to recover:\n\u2022 Zeus' original thunderbolt (the proto-bolt, forged by Cyclopes)\n\u2022 Poseidon's first trident\n\u2022 Hades' Helm of Darkness\n\nAll three were used to defeat Kronos the first time. Are they still potent?",
      color: NODE_COLORS.perplexityCard,
    },
  },
  {
    id: "myth-ares",
    type: "digitalTwin",
    position: { x: COL.war, y: ROW.r3 },
    data: {
      name: "Ares",
      mode: "contraddici" as const,
      personality: "God of War. Brutal, honest, contrarian. Challenges every soft strategy. Believes strength is the only answer. Mocks diplomacy as cowardice. If someone proposes peace, he asks what happens when peace fails.",
      lastResponse: "",
      status: "idle" as const,
      color: NODE_COLORS.perplexityCard,
    },
  },
  {
    id: "myth-artemis",
    type: "digitalTwin",
    position: { x: COL.war, y: ROW.r4 },
    data: {
      name: "Artemis",
      mode: "collabora" as const,
      personality: "Goddess of the Hunt and Wilderness. Pragmatic, resourceful, independent. While Ares sees only brute force, she proposes guerrilla tactics, ambushes, strategic retreats. Builds on ideas by grounding them in nature and survival instinct.",
      lastResponse: "",
      status: "idle" as const,
      color: NODE_COLORS.perplexityCard,
    },
  },

  // ── Column 4 — Cyan: Nature & Diplomacy ───────────────────────
  {
    id: "myth-diplomacy",
    type: "conceptCard",
    position: { x: COL.diplomacy, y: ROW.r0 },
    data: {
      title: "Diplomatic Envoy to the Titans",
      description: "Send Hermes as emissary. Propose a new cosmic order — shared dominion rather than subjugation. Some Titans (Prometheus, Epimetheus) may prefer peace. Risk: perceived as weakness, or a trap.",
      tags: ["diplomacy", "hermes", "peace"],
      color: NODE_COLORS.imageUpload,
    },
  },
  {
    id: "myth-nature",
    type: "conceptCard",
    position: { x: COL.diplomacy, y: ROW.r1 },
    data: {
      title: "Harness the Elemental Forces",
      description: "The natural world itself resists Titan resurrection — earthquakes, storms, tidal waves. Channel these forces deliberately. Poseidon controls the seas, Demeter the earth. Nature as weapon and shield.",
      tags: ["elements", "nature", "poseidon"],
      color: NODE_COLORS.imageUpload,
    },
  },
  {
    id: "myth-note-fate",
    type: "text",
    position: { x: COL.diplomacy, y: ROW.r2 },
    data: {
      text: "The Moirai (Fates) remain neutral. They weave destiny for gods and Titans alike. Could they be persuaded? Or is their neutrality itself the key — what if the outcome is already woven?",
      color: NODE_COLORS.imageUpload,
    },
  },
  {
    id: "myth-apollo",
    type: "digitalTwin",
    position: { x: COL.diplomacy, y: ROW.r3 },
    data: {
      name: "Apollo",
      mode: "collabora" as const,
      personality: "God of Light, Music, and Prophecy. The eternal collaborator — builds on every idea, finds the harmony between opposing views. Speaks poetically. Sees connections others miss. Believes art and beauty are themselves forms of power.",
      lastResponse: "",
      status: "idle" as const,
      color: NODE_COLORS.imageUpload,
    },
  },
  {
    id: "myth-dionysus",
    type: "digitalTwin",
    position: { x: COL.diplomacy, y: ROW.r4 },
    data: {
      name: "Dionysus",
      mode: "provoca" as const,
      personality: "God of Wine, Madness, and Ecstasy. Sees rationality as a cage. Challenges the very premise of diplomacy — what if chaos is the natural order? What if the Titans are right? Speaks in paradoxes, disrupts comfortable consensus.",
      lastResponse: "",
      status: "idle" as const,
      color: NODE_COLORS.imageUpload,
    },
  },
];

export const initialColorLabels: ColorLabels = {
  [NODE_COLORS.goalCard]: "Olympus",
  [NODE_COLORS.conceptCard]: "Wisdom",
  [NODE_COLORS.perplexityCard]: "War",
  [NODE_COLORS.imageUpload]: "Diplomacy",
};
