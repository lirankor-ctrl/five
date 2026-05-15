import type { ParticipantPreset } from "@/lib/family/types";

export type PresetMeta = {
  id: ParticipantPreset;
  label: string;
  hint: string;
};

export const participantPresets: PresetMeta[] = [
  { id: "whole-family", label: "Whole family", hint: "Everyone at home." },
  {
    id: "parent-child",
    label: "Parent + child",
    hint: "One parent, one child.",
  },
  {
    id: "parent-daughter",
    label: "Parent + daughter",
    hint: "One parent, one daughter.",
  },
  {
    id: "parent-son",
    label: "Parent + son",
    hint: "One parent, one son.",
  },
  { id: "couple", label: "Couple", hint: "The two of you." },
  { id: "siblings", label: "Siblings", hint: "Brothers and sisters." },
  {
    id: "grandparent-grandchild",
    label: "Grandparent + grandchild",
    hint: "One grandparent, one grandchild.",
  },
  {
    id: "extended-family",
    label: "Extended family",
    hint: "Aunts, uncles, cousins.",
  },
  {
    id: "flexible",
    label: "Flexible",
    hint: "Whoever is around.",
  },
];

export function getPreset(id: string) {
  return participantPresets.find((p) => p.id === id);
}
