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
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filter, setFilter] = useState<JobFilter>(initFilter);
  const [loading, setLoading] = useState<boolean>(false);

  const onUpdateFilter = (key: keyof JobFilter, value: any) => {
    setFilter((oldValue) => ({ ...oldValue, [key]: value }));
  };

  const getJobs = async () => {
    setLoading(true);
    const data = await getJobsApi(filter);
    setLoading(false);
    setJobData(data);
  };

  const getJob = async (id: number) => {
    setLoading(true);
    const job: Job | null = await getJobApi(id);
    setLoading(false);
    setSelectedJob(job);
  };

  const createJob = async (body: Partial<Job>) => {
    setLoading(true);
    const job: Job | null = await createJobApi(body);
    if (job) {
      getJobs();

      return;
    }
    setLoading(false);
  };

  const updateJob = async  (id: number, body: Partial<Job>) => {
    setLoading(true);
    const success: boolean = await updateJobApi(id, body);
    if (success) {
      getJobs();

      return;
    }
    setLoading(false);
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
    selectedJob,
    filter,
    loading,
    onUpdateFilter,
    setSelectedJob,
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
  };
};
