import type { DrumSoundId } from './audio';

export interface Patch {
  id: number; // 1..16
  name: string;
  note: number | null;
  channel: number | null;
  velocity: number; // default velocity / last received
  sound: DrumSoundId;
  volume: number; // 0..1
  enabled: boolean;
  playbackMode: 'oneshot' | 'hold';
  // Optional user-loaded audio sample. When sampleKey is set and the buffer
  // is present in the audio engine, the real sample plays instead of the synth.
  sampleKey: string | null;
  sampleName: string | null;
}

export interface Kit {
  id: string;
  name: string;
  patches: Patch[];
}

export interface MidiDeviceInfo {
  id: string;
  name: string;
  manufacturer: string;
  state: 'connected' | 'disconnected';
  connection: 'open' | 'closed' | 'pending';
  input: MIDIInput;
}

export interface MonitorEntry {
  id: number;
  device: string;
  channel: number;
  type: string;
  note: number;
  velocity: number;
  onOff: 'ON' | 'OFF';
  timestamp: number;
  patch: number | null;
  sound: string | null;
}
