import { useState } from 'react';
import { JobContextState } from 'context';
import { Job, JobFilter } from 'constant';
import { createJobApi, deleteJobApi, getJobApi, getJobsApi, updateJobApi } from 'services';

const initJobData: JobContextState['jobData'] = {
  data: [],
  total: 0
};

const initFilter: JobFilter = {
  page: 0,
  size: 5
};

export const useJobState = (): JobContextState => {
  const [jobData, setJobData] = useState<JobContextState['jobData']>(initJobData);
  const [filter, setFilter] = useState<JobFilter>(initFilter);
  const [loading, setLoading] = useState<boolean>(false);

  const onUpdateFilter = (key: keyof JobFilter, value: any) => {
    setFilter((oldValue) => ({ ...oldValue, [key]: value }));
  };

  const getJobs = async () => {
    setLoading(true);
    const data = await getJobsApi(filter);
    setJobData(data);
    setLoading(false);
  };

  const getJob = async (id: number) => {
    setLoading(true);
    const job: Job | null = await getJobApi(id);
    setLoading(false);

    return job;
  };

  const createJob = async (body: Partial<Job>): Promise<boolean> => {
    setLoading(true);
    const success: boolean = await createJobApi(body);
    setLoading(false);

    return success;
  };

  const updateJob = async  (id: number, body: Partial<Job>): Promise<boolean> => {
    setLoading(true);
    const success: boolean = await updateJobApi(id, body);
    setLoading(false);

    return success;
  };

  const deleteJob = async (id: number) => {
    setLoading(true);
    const success: boolean = await deleteJobApi(id);
    if (success) {
      getJobs();

      return;
    }
    setLoading(false);
  };


  return {
    jobData,
    filter,
    loading,
    onUpdateFilter,
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
  };
};
