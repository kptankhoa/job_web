import React, { useEffect } from 'react';
import { HeaderPageContainer } from 'components';
import { useJobContext } from 'context';
import JobTable from './JobTable';

const JobListPage = () => {
  const { filter, getJobs } = useJobContext();
  useEffect(() => {
    getJobs();
  }, [filter]);

  return (
    <HeaderPageContainer
      pageTitle="Job list"
    >
      <div
        style={{
          height: 500
        }}
      >
        <JobTable />
      </div>
    </HeaderPageContainer>
  );
};

export default JobListPage;
