// Minimal Web MIDI API typings (subset used by this app).
// Avoids dependency on @types/w3c-web-midi which isn't in the project.

declare global {
  interface MIDIMessageEvent extends Event {
    data: Uint8Array;
    timeStamp: number;
    target: EventTarget | null;
  }

  interface MIDIInput extends EventTarget {
    id: string;
    name: string | null;
    manufacturer: string | null;
    state: 'connected' | 'disconnected';
    connection: 'open' | 'closed' | 'pending';
    onmidimessage: ((e: MIDIMessageEvent) => void) | null;
  }

  interface MIDIOutputMap {
    forEach(cb: (output: MIDIOutput) => void): void;
  }

  interface MIDIInputMap {
    forEach(cb: (input: MIDIInput) => void): void;
    size: number;
  }

  interface MIDIOutput extends EventTarget {
    id: string;
    name: string | null;
  }

  interface MIDIAccess extends EventTarget {
    inputs: MIDIInputMap;
    outputs: MIDIOutputMap;
    onstatechange: ((e: Event) => void) | null;
    sysexEnabled: boolean;
  }

  interface Navigator {
    requestMIDIAccess(options?: { sysex?: boolean }): Promise<MIDIAccess>;
  }
}

export {};
