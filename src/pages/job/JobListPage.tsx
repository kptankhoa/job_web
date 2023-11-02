import React, { useEffect } from 'react';
import { Button, HeaderPageContainer } from 'components';
import { useJobContext } from 'context';
import JobTable from './components/JobTable';
import { useNavigate } from 'react-router-dom';
import { PAGE_ROUTE } from 'constant';

const JobListPage = () => {
  const { filter, getJobs } = useJobContext();
  const navigate = useNavigate();
  useEffect(() => {
    getJobs();
  }, [filter]);

  return (
    <HeaderPageContainer
      pageTitle="Job List"
    >
      <div
        style={{ height: 500, width: '100%' }}
      >
        <JobTable />
      </div>
      <div
        style={{
          marginTop: 16,
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(PAGE_ROUTE.NEW_JOB)}
        >
          Add new job
        </Button>
      </div>
    </HeaderPageContainer>
  );
};

export default JobListPage;
