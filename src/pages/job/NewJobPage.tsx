import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, useTheme } from '@mui/material';
import { useJobContext } from 'context';
import { HeaderPageContainer } from 'components';
import JobDataForm from './components/JobDataForm';
import { Job, PAGE_ROUTE } from 'constant';

const NewJobPage = () => {
  const { loading, createJob } = useJobContext();
  const [editingData, setEditingData] = useState<Partial<Job>>({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const onChange = (key: keyof Job, value: any) => {
    setEditingData((oldValue) => ({ ...oldValue, [key]: value }));
  };

  const onCancel = () => navigate(PAGE_ROUTE.JOBS);

  const onSubmit = async () => {
    const success = await createJob(editingData);
    if (success) {
      navigate(PAGE_ROUTE.JOBS);
    } else {
      setError('Cannot create job');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <HeaderPageContainer
      pageTitle="New Job"
    >
      <div
        style={{ maxWidth: 700 }}
      >
        {error && (
          <Typography
            style={{
              padding: 10,
              fontSize: 18,
              color: theme.palette.error.main
            }}
          >
            {error}
          </Typography>
        )}
        <JobDataForm
          disabled={!!(error || loading)}
          mode="create"
          data={editingData}
          onChange={onChange}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </div>
    </HeaderPageContainer>
  );
};

export default NewJobPage;
