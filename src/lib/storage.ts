import type { DrumSoundId } from './audio';
import { DEFAULT_PATCH_SOUNDS, KIT_PRESETS } from './audio';
import type { Patch, Kit } from './types';

const PATCH_STORAGE_KEY = 'midi-drum-pad-prototype:patches:v2';
const KITS_STORAGE_KEY = 'midi-drum-pad-prototype:kits:v1';
const SELECTED_KIT_KEY = 'midi-drum-pad-prototype:selected-kit:v1';

export const PATCH_COUNT = 16;

export function defaultPatches(kitSounds: DrumSoundId[] = DEFAULT_PATCH_SOUNDS): Patch[] {
  return Array.from({ length: PATCH_COUNT }, (_, i) => ({
    id: i + 1,
    name: `Patch ${i + 1}`,
    note: null,
    channel: null,
    velocity: 100,
    sound: kitSounds[i] ?? ('kick' as DrumSoundId),
    volume: 0.8,
    enabled: true,
    playbackMode: 'oneshot' as const,
    sampleKey: null,
    sampleName: null,
  }));
}

// Build the 10 default kits from KIT_PRESETS.
export function defaultKits(): Kit[] {
  return KIT_PRESETS.map((preset) => ({
    id: preset.id,
    name: preset.name,
    patches: defaultPatches(preset.sounds),
  }));
}

export function loadKits(): Kit[] {
  try {
    const raw = localStorage.getItem(KITS_STORAGE_KEY);
    if (!raw) return defaultKits();
    const parsed = JSON.parse(raw) as Kit[];
    if (!Array.isArray(parsed) || parsed.length < 1) return defaultKits();
    return parsed;
  } catch {
    return defaultKits();
  }
}

export function saveKits(kits: Kit[]): void {
  try {
    localStorage.setItem(KITS_STORAGE_KEY, JSON.stringify(kits));
  } catch {
    // ignore quota errors
  }
}

export function loadSelectedKitId(): string | null {
  try {
    return localStorage.getItem(SELECTED_KIT_KEY);
  } catch {
    return null;
  }
}

export function saveSelectedKitId(id: string): void {
  try {
    localStorage.setItem(SELECTED_KIT_KEY, id);
  } catch {
    // ignore
  }
}

// Load patches for a specific kit id from the stored kits list.
export function loadPatchesForKit(kitId: string): Patch[] {
  const kits = loadKits();
  const kit = kits.find((k) => k.id === kitId);
  if (kit && Array.isArray(kit.patches) && kit.patches.length === PATCH_COUNT) {
    return normalizePatches(kit.patches);
  }
  const preset = KIT_PRESETS.find((p) => p.id === kitId);
  return defaultPatches(preset?.sounds);
}

// Backward-compatible standalone patch load (used only for migration/edge cases).
export function loadPatches(): Patch[] {
  try {
    const raw = localStorage.getItem(PATCH_STORAGE_KEY);
    if (!raw) return defaultPatches();
    const parsed = JSON.parse(raw) as Patch[];
    return normalizePatches(parsed);
  } catch {
    return defaultPatches();
  }
}

// Normalize any patch array to exactly PATCH_COUNT entries, filling defaults.
// Handles old 32-entry saved data by slicing to 16.
function normalizePatches(arr: Patch[]): Patch[] {
  if (!Array.isArray(arr)) return defaultPatches();
  const sliced = arr.slice(0, PATCH_COUNT);
  const defaults = defaultPatches();
  return defaults.map((d, i) => {
    const existing = sliced[i];
    if (!existing) return d;
    return {
      ...d,
      ...existing,
      sampleKey: existing.sampleKey ?? null,
      sampleName: existing.sampleName ?? null,
    };
  });
}

export function savePatches(patches: Patch[]): void {
  try {
    localStorage.setItem(PATCH_STORAGE_KEY, JSON.stringify(patches));
  } catch {
    // ignore quota errors
  }
}

export function exportPatches(patches: Patch[]): string {
  return JSON.stringify({ version: 2, patches }, null, 2);
}

export function importPatches(json: string): Patch[] {
  const parsed = JSON.parse(json) as { patches?: Patch[] };
  if (!parsed.patches || !Array.isArray(parsed.patches)) {
    throw new Error('Invalid mapping file: missing patches array.');
  }
  return normalizePatches(parsed.patches);
}
