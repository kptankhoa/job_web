import { createContext, useContext } from 'react';
import { BlobData, RecordData, RECORDING_STATE } from '../const';

export interface RecordingState {
  recordingState: RECORDING_STATE;
  transcriptData: string;
  newRecordData: RecordData | null;
  blobDataMap: {
    [key: string]: BlobData
  };
  setTranscriptData: (value: string) => void;
  onRecord: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
}

export const RecordingContext = createContext<RecordingState>({} as RecordingState);

export const useRecordingContext = () => useContext(RecordingContext);