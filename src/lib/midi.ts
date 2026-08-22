// Web MIDI message parsing helpers.

export const MIDI_COMMAND = {
  NOTE_OFF: 0x80,
  NOTE_ON: 0x90,
  CONTROL_CHANGE: 0xb0,
  PROGRAM_CHANGE: 0xc0,
  PITCH_BEND: 0xe0,
} as const;

export interface MidiNoteEvent {
  type: 'noteon' | 'noteoff';
  channel: number;
  note: number;
  velocity: number;
  timestamp: number;
}

export interface MidiRawEvent {
  command: number;
  channel: number;
  data1: number;
  data2: number;
  timestamp: number;
}

export function parseMidiMessage(
  data: Uint8Array,
  timestamp: number
): MidiRawEvent | null {
  if (!data || data.length < 2) return null;
  const status = data[0];
  if (status < 0x80) return null; // running status / invalid
  const command = status & 0xf0;
  const channel = (status & 0x0f) + 1; // 1-16
  const data1 = data[1] & 0x7f;
  const data2 = data.length > 2 ? data[2] & 0x7f : 0;
  return { command, channel, data1, data2, timestamp };
}

export function isNoteOn(e: MidiRawEvent): boolean {
  return e.command === MIDI_COMMAND.NOTE_ON && e.data2 > 0;
}

export function isNoteOff(e: MidiRawEvent): boolean {
  return (
    e.command === MIDI_COMMAND.NOTE_OFF ||
    (e.command === MIDI_COMMAND.NOTE_ON && e.data2 === 0)
  );
}

export function commandName(command: number, velocity: number): string {
  switch (command) {
    case MIDI_COMMAND.NOTE_ON:
      return velocity === 0 ? 'NOTE OFF' : 'NOTE ON';
    case MIDI_COMMAND.NOTE_OFF:
      return 'NOTE OFF';
    case MIDI_COMMAND.CONTROL_CHANGE:
      return 'CONTROL CHANGE';
    case MIDI_COMMAND.PROGRAM_CHANGE:
      return 'PROGRAM CHANGE';
    case MIDI_COMMAND.PITCH_BEND:
      return 'PITCH BEND';
    default:
      return `0x${command.toString(16).toUpperCase()}`;
  }
}

// Standard GM drum kit note names (channel 10).
const DRUM_NAMES: Record<number, string> = {
  35: 'Acoustic Bass Drum',
  36: 'Bass Drum 1',
  37: 'Side Stick',
  38: 'Acoustic Snare',
  39: 'Hand Clap',
  40: 'Electric Snare',
  41: 'Low Floor Tom',
  42: 'Closed Hi-Hat',
  43: 'High Floor Tom',
  44: 'Pedal Hi-Hat',
  45: 'Low Tom',
  46: 'Open Hi-Hat',
  47: 'Low-Mid Tom',
  48: 'Hi-Mid Tom',
  49: 'Crash Cymbal 1',
  50: 'High Tom',
  51: 'Ride Cymbal 1',
  52: 'Chinese Cymbal',
  53: 'Ride Bell',
  54: 'Tambourine',
  55: 'Splash Cymbal',
  56: 'Cowbell',
  57: 'Crash Cymbal 2',
  58: 'Vibraslap',
  59: 'Ride Cymbal 2',
  60: 'Hi Bongo',
  61: 'Low Bongo',
  62: 'Mute Hi Conga',
  63: 'Open Hi Conga',
  64: 'Low Conga',
  65: 'High Timbale',
  66: 'Low Timbale',
  67: 'High Agogo',
  68: 'Low Agogo',
  69: 'Cabasa',
  70: 'Maracas',
  71: 'Short Whistle',
  72: 'Long Whistle',
  73: 'Short Guiro',
  74: 'Long Guiro',
  75: 'Claves',
  76: 'Hi Wood Block',
  77: 'Low Wood Block',
  78: 'Mute Cuica',
  79: 'Open Cuica',
  80: 'Mute Triangle',
  81: 'Open Triangle',
};

export function noteName(note: number): string {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(note / 12) - 1;
  return `${names[note % 12]}${octave}`;
}

export function drumName(note: number): string {
  return DRUM_NAMES[note] ?? noteName(note);
}
