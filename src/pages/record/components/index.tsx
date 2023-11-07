import { Grid, Typography } from '@mui/material';
import React from 'react';
import RecordingControl from './RecordingControl';
import { useRecordingContext } from '../context/RecordingState';
import TranscriptContainer from './TranscriptContainer';
import { HeaderPageContainer } from 'components';

const Container = () => {
  const { transcriptData } = useRecordingContext();

  return (
    <HeaderPageContainer
      pageTitle="Record"
    >
      <Grid
        container
        spacing={3}
      >
        <Grid item xs={12}>
          <RecordingControl />
        </Grid>
        <Grid item xs={12} style={{ height: 200 }}>
          <Typography component="h3" sx={{ fontWeight: 'bold ' }}>
            Generated:
          </Typography>
          <br/>
          <Typography>
            {transcriptData}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TranscriptContainer />
        </Grid>
      </Grid>
    </HeaderPageContainer>
  );
};

export default Container;
