export enum RECORDING_STATE {
  INIT = 'INIT',
  RECORDING = 'RECORDING',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
  GENERATING_REPORT = 'GENERATING_REPORT'
}

export enum WS_STATE {
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export enum RECORDING_TYPE {
  CT = 'CT',
  CXR = 'CXR'
}

export interface BlobData {
  id: number,
  blob: Blob,
  transcript: string | null
}
export interface RecordData {
  blob: Blob,
  timestamp: number,
  vad: number[]
}

export interface CreateAudioStream {
  attributes: object,
  setRecordRTC: any,
  mapNewStream: any
}

export const VAD_STREAM_TIME_SLICE = 500; // milliseconds

export const LEGIT_VAD_VOICE_DETECTED_CHARACTERS = 30;

export const NO_VOICE_DETECTION_CHARACTER = '0';

export const NO_VOICE_DETECTION_CHARACTER_OCCURRENCES = 20;

export const SILENCE_COUNTER_LIMIT = 3;

// export const SPEECH_TO_TEXT_WS = 'wss://api-draid.aiscaler.net/speech2text-service/speech2text-service';
export const SPEECH_TO_TEXT_WS = 'ws://10.208.208.231:8080/speech2text-service';
// export const SPEECH_TO_TEXT_WS = 'wss://api.draid.ai/speech2text-service';

export const API_SENME_PLUGIN_WSS = 'wss://senme-plugin-beta.aiscaler.net';

export const PAUSE_TIME = 300;
export const NON_SPEECH_THRESHOLD = PAUSE_TIME / 10; // 30
export const PRE_SPEECH_BUFFER = PAUSE_TIME / 10 - 10; // 10 - 10
export const POST_SPEECH_BUFFER = NON_SPEECH_THRESHOLD - 20;
export const VAD_DELAY = 10;
export const UNIT = 480;
export const MIN_AUDIO_UNIT = 200; //200 UNIT each 10ms = 2s
export const MIN_SPEECH_LEN = 50; // 30 UNIT each 10ms = 300ms

