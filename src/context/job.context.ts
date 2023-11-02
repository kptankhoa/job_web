import { createContext, useContext } from 'react';
import { Job, JobFilter } from 'constant';

export interface JobContextState {
  jobData: {
    data: Job[];
    total: number;
  };
  selectedJob: Job | null;
  filter: JobFilter;
  loading: boolean;
  onUpdateFilter: (key: keyof JobFilter, value: any) => void;
  setSelectedJob: (job: Job) => void;
  getJobs: () => void;
  getJob: (id: number) => void;
  createJob: (body: Partial<Job>) => void;
  updateJob: (id: number, body: Partial<Job>) => void;
  deleteJob: (id: number) => void;
}

export const JobContext = createContext<JobContextState>({} as JobContextState);

export const useJobContext = () => useContext(JobContext);
