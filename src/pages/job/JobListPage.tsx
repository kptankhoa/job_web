import React, { useEffect } from 'react';
import { HeaderPageContainer } from 'components';
import { useJobContext } from 'context';
import JobTable from './components/JobTable';

const JobListPage = () => {
  const { filter, getJobs } = useJobContext();
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
    </HeaderPageContainer>
  );
};

export default JobListPage;
