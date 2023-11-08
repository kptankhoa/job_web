import React, { useRef } from 'react';
import { useRecordingContext } from '../context/RecordingState';
import { RECORDING_STATE } from '../const';
import { Grid } from '@mui/material';
import { Button } from 'components';
import { downloadBlob } from '../util/recording.util';
import AudioPlayer from './AudioPlayer';


const ControlButton = ({
  onClick, name, disabled
}: any) => (
  <Grid item>
    <Button
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClick={disabled ? () => {} : onClick}
      disabled={disabled}
      variant="contained"
      color="primary"
    >
      {name}
    </Button>
  </Grid>
);

export interface RecordingControlProps {
  dragging: boolean;
  setDisabledDragging: (value: boolean) => void;
}

const RecordingControl = () => {
  const {
    recordingState,
    recordedBlob,
    onUpload,
    onRecord,
    onPause,
    onStop,
    onReset,
  } = useRecordingContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const onDownloadRecordBlob = () => {
    if (!recordedBlob) {
      return;
    }

    downloadBlob(recordedBlob, 'recorded.wav');
  };

  const onFileUploadChange = (e: any) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    onUpload(url);
  };

  if (recordingState === RECORDING_STATE.INIT) {
    return (
      <Grid container spacing={3}>
        <ControlButton
          onClick={() => inputRef.current?.click()}
          name="Upload"
        />
        <ControlButton
          onClick={onRecord}
          name="Record"
        />
        <input
          type="file"
          accept="audio/*"
          ref={inputRef}
          onChange={onFileUploadChange}
          style={{ display: 'none' }} // Hide the input element
        />
      </Grid>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {recordingState === RECORDING_STATE.RECORDING && (
          <ControlButton
            onClick={onPause}
            name="Pause"
          />
        )}
        {[RECORDING_STATE.PAUSED, RECORDING_STATE.STOPPED, RECORDING_STATE.GENERATING_REPORT].includes(recordingState) && (
          <ControlButton
            onClick={onRecord}
            name="Play"
            disabled={[RECORDING_STATE.STOPPED, RECORDING_STATE.GENERATING_REPORT].includes(recordingState)}
          />
        )}
        <ControlButton
          onClick={onStop}
          name="Stop"
          disabled={[RECORDING_STATE.STOPPED, RECORDING_STATE.GENERATING_REPORT].includes(recordingState)}
        />
        <ControlButton
          onClick={onReset}
          name="Clear"
        />
        {recordedBlob && (
          <>
            <ControlButton
              onClick={onDownloadRecordBlob}
              name="Download Record"
            />
            <Grid item>
              <AudioPlayer blob={recordedBlob} />
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default RecordingControl;
