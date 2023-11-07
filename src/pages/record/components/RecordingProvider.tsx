import React, { ReactElement } from 'react';
import { RecordingContext } from '../context/RecordingState';
import useRecordingState from '../context/useRecordingState';

interface Props {
  children: ReactElement;
}

const RecordingProvider = ({ children }: Props) => (
  <RecordingContext.Provider value={useRecordingState()}>
    {children}
  </RecordingContext.Provider>
);

export default RecordingProvider;
