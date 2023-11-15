import { createContext, useContext } from 'react';
import { BlobData, RECORDING_STATE } from '../const';

export interface RecordingState {
  recordingState: RECORDING_STATE;
  transcriptData: string;
  blobDataMap: {
    [key: string]: BlobData
  };
  recordedBlob: Blob | null;
  setTranscriptData: (value: string) => void;
  onUpload: (url: string) => void;
  onRecord: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
}

export const RecordingContext = createContext<RecordingState>({} as RecordingState);

export const useRecordingContext = () => useContext(RecordingContext);
