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
  transcript: string
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

export const VAD_STREAM_TIME_SLICE = 1000; // milliseconds

export const LEGIT_VAD_VOICE_DETECTED_CHARACTERS = 30;

export const NO_VOICE_DETECTION_CHARACTER = '0';

export const NO_VOICE_DETECTION_CHARACTER_OCCURRENCES = 20;

export const SILENCE_COUNTER_LIMIT = 3;

export const SPEECH_TO_TEXT_WS = 'wss://api-draid.aiscaler.net/speech2text-service';

export const API_SENME_PLUGIN_WSS = 'wss://senme-plugin-beta.aiscaler.net';
