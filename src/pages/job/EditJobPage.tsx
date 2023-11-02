import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { useJobContext } from 'context';
import { HeaderPageContainer } from 'components';
import JobDataForm from './components/JobDataForm';
import { Job, PAGE_ROUTE } from 'constant';

const EditJobPage = () => {
  const { loading, getJob, updateJob } = useJobContext();
  const [editingData, setEditingData] = useState<Partial<Job>>({});
  const [error, setError] = useState('');
  const id = Number(useParams().id) || 0;
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (id) {
      getJob(Number(id))
        .then((res) => {
          if (res) {
            setEditingData(res);
          } else {
            setError('Cannot get Job right now!');
          }
        });
    } else {
      setError('Invalid job ID');
    }
  }, [id]);

  const onChange = (key: keyof Job, value: any) => {
    setEditingData((oldValue) => ({ ...oldValue, [key]: value }));
  };

  const onCancel = () => navigate(PAGE_ROUTE.JOBS);

  const onSubmit = async () => {
    const success = await updateJob(id, editingData);
    if (success) {
      navigate(PAGE_ROUTE.JOBS);
    } else {
      setError('Cannot update job');
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <HeaderPageContainer
      pageTitle={`Edit Job (${editingData.title})`}
    >
      <div
        style={{ maxWidth: 700 }}
      >
        {error && (
          <div
            style={{
              color: theme.palette.error.main
            }}
          >
            {error}
          </div>
        )}
        <JobDataForm
          disabled={!!(error || loading)}
          mode="update"
          data={editingData}
          onChange={onChange}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </div>
    </HeaderPageContainer>
  );
};

export default EditJobPage;
