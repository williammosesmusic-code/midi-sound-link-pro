import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Patch, Kit } from '@/lib/types';
import {
  loadKits,
  saveKits,
  loadSelectedKitId,
  saveSelectedKitId,
  loadPatchesForKit,
  defaultKits,
} from '@/lib/storage';
import { DRUM_SOUNDS } from '@/lib/audio';
import { drumName } from '@/lib/midi';

export type LearnTarget = { patchId: number } | null;

export interface DuplicateConflict {
  patchId: number; // patch that wants the note
  note: number;
  channel: number;
  existingPatchId: number; // patch already holding the note
}

export function usePatches() {
  const [kits, setKits] = useState<Kit[]>(() => loadKits());
  const [selectedKitId, setSelectedKitId] = useState<string>(() => {
    const saved = loadSelectedKitId();
    const kits = loadKits();
    return saved && kits.some((k) => k.id === saved) ? saved : (kits[0]?.id ?? 'standard');
  });
  const [patches, setPatches] = useState<Patch[]>(() => loadPatchesForKit(loadSelectedKitId() ?? 'standard'));
  const [learnTarget, setLearnTarget] = useState<LearnTarget>(null);
  const [pendingNote, setPendingNote] = useState<{
    channel: number;
    note: number;
    velocity: number;
  } | null>(null);
  const [conflict, setConflict] = useState<DuplicateConflict | null>(null);
  const [lastHitPatchId, setLastHitPatchId] = useState<number | null>(null);
  const hitTimerRef = useRef<number | null>(null);

  // Refs to avoid stale closures in the MIDI callback chain.
  const patchesRef = useRef(patches);
  patchesRef.current = patches;
  const learnTargetRef = useRef(learnTarget);
  learnTargetRef.current = learnTarget;

  const selectedKit = kits.find((k) => k.id === selectedKitId) ?? kits[0] ?? defaultKits()[0];

  // Persist kits whenever they change.
  useEffect(() => {
    saveKits(kits);
  }, [kits]);

  // Persist the selected kit id.
  useEffect(() => {
    saveSelectedKitId(selectedKitId);
  }, [selectedKitId]);

  // Sync patches back into the current kit whenever patches change.
  useEffect(() => {
    setKits((prev) =>
      prev.map((k) => (k.id === selectedKitId ? { ...k, patches } : k))
    );
  }, [patches, selectedKitId]);

  const noteToPatch = useMemo(() => {
    const map = new Map<string, Patch>();
    for (const p of patches) {
      if (p.note !== null && p.channel !== null) {
        map.set(`${p.channel}:${p.note}`, p);
      }
    }
    return map;
  }, [patches]);

  const resolvePatch = useCallback(
    (channel: number, note: number) => {
      const patch = noteToPatch.get(`${channel}:${note}`);
      if (!patch) return null;
      return { id: patch.id, sound: DRUM_SOUNDS.find((s) => s.id === patch.sound)?.label ?? patch.sound };
    },
    [noteToPatch]
  );

  // Called when a NOTE ON arrives from the MIDI hook.
  // Reads from refs so it always has the latest learnTarget and patches
  // without needing to be recreated on every state change.
  const handleNoteOn = useCallback(
    (channel: number, note: number, velocity: number) => {
      const lt = learnTargetRef.current;
      const currentPatches = patchesRef.current;

      if (lt) {
        // Capture into learn target.
        const existing = currentPatches.find(
          (p) => p.note === note && p.channel === channel && p.id !== lt.patchId
        );
        if (existing) {
          setPendingNote({ channel, note, velocity });
          setConflict({ patchId: lt.patchId, note, channel, existingPatchId: existing.id });
          return;
        }
        setPatches((prev) =>
          prev.map((p) =>
            p.id === lt.patchId
              ? { ...p, note, channel, velocity }
              : p
          )
        );
        setLearnTarget(null);
        return;
      }

      // Normal trigger path.
      const patch = currentPatches.find(
        (p) => p.note === note && p.channel === channel && p.enabled
      );
      if (patch) {
        setLastHitPatchId(patch.id);
        if (hitTimerRef.current) window.clearTimeout(hitTimerRef.current);
        hitTimerRef.current = window.setTimeout(() => setLastHitPatchId(null), 250);
      }
    },
    []
  );

  const handleNoteOff = useCallback(
    (_channel: number, _note: number) => {
      // NOTE OFF release handled by audio engine via App trigger path.
    },
    []
  );

  const startLearn = useCallback((patchId: number) => {
    setLearnTarget({ patchId });
    setConflict(null);
    setPendingNote(null);
  }, []);

  const cancelLearn = useCallback(() => {
    setLearnTarget(null);
    setConflict(null);
    setPendingNote(null);
  }, []);

  const resolveConflict = useCallback(
    (decision: 'replace' | 'cancel' | 'duplicate') => {
      if (!conflict || !pendingNote) return;
      if (decision === 'cancel') {
        setConflict(null);
        setPendingNote(null);
        setLearnTarget(null);
        return;
      }
      const { patchId, note, channel } = conflict;
      setPatches((prev) =>
        prev.map((p) => {
          if (decision === 'replace' && p.id === conflict.existingPatchId) {
            return { ...p, note: null, channel: null };
          }
          if (p.id === patchId) {
            return { ...p, note, channel, velocity: pendingNote.velocity };
          }
          return p;
        })
      );
      setConflict(null);
      setPendingNote(null);
      setLearnTarget(null);
    },
    [conflict, pendingNote]
  );

  const updatePatch = useCallback((patchId: number, updates: Partial<Patch>) => {
    setPatches((prev) => prev.map((p) => (p.id === patchId ? { ...p, ...updates } : p)));
  }, []);

  const clearPatch = useCallback((patchId: number) => {
    setPatches((prev) =>
      prev.map((p) => (p.id === patchId ? { ...p, note: null, channel: null } : p))
    );
  }, []);

  const switchKit = useCallback((kitId: string) => {
    setSelectedKitId(kitId);
    setPatches(loadPatchesForKit(kitId));
    setLearnTarget(null);
    setConflict(null);
    setPendingNote(null);
  }, []);

  const resetAll = useCallback(() => {
    const fresh = loadPatchesForKit(selectedKitId);
    setPatches(fresh);
    setLearnTarget(null);
    setConflict(null);
    setPendingNote(null);
  }, [selectedKitId]);

  const importAll = useCallback((newPatches: Patch[]) => {
    setPatches(newPatches);
    setLearnTarget(null);
    setConflict(null);
    setPendingNote(null);
  }, []);

  const saveNow = useCallback((): boolean => {
    try {
      saveKits(kits.map((k) => (k.id === selectedKitId ? { ...k, patches } : k)));
      saveSelectedKitId(selectedKitId);
      return true;
    } catch {
      return false;
    }
  }, [kits, selectedKitId, patches]);

  return {
    kits,
    selectedKitId,
    selectedKit,
    patches,
    learnTarget,
    conflict,
    pendingNote,
    lastHitPatchId,
    resolvePatch,
    handleNoteOn,
    handleNoteOff,
    startLearn,
    cancelLearn,
    resolveConflict,
    updatePatch,
    clearPatch,
    switchKit,
    resetAll,
    importAll,
    saveNow,
    drumName,
  };
}
