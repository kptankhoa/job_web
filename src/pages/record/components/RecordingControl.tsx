import React from 'react';
import { useRecordingContext } from '../context/RecordingState';
import { RECORDING_STATE } from '../const';
import { Grid } from '@mui/material';
import { Button } from 'components';


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
    onRecord,
    onPause,
    onStop,
    onReset,
  } = useRecordingContext();

  if (recordingState === RECORDING_STATE.INIT) {
    return (
      <ControlButton
        onClick={onRecord}
        name="Record"
      />
    );
  }

  return (
    <>
      <Grid container spacing={3}
      >
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
      </Grid>
    </>
  );
};

export default RecordingControl;
