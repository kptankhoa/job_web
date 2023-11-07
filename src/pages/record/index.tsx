import React from 'react';
import RecordingProvider from './components/RecordingProvider';
import Container from './components';

const ReportRecording = () => (
  <RecordingProvider>
    <Container />
  </RecordingProvider>
);

export default ReportRecording;
