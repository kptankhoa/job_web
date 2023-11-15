import React, { ReactElement } from 'react';
import { RecordingContext } from '../context/RecordingState';
import useRecordingStateStream from '../context/useRecordingStateStream';

interface Props {
  children: ReactElement;
}

const RecordingProvider = ({ children }: Props) => (
  <RecordingContext.Provider value={useRecordingStateStream()}>
    {children}
  </RecordingContext.Provider>
);

export default RecordingProvider;
