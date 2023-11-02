import { createContext, useContext } from 'react';
import { Job, JobFilter } from 'constant';

export interface JobContextState {
  jobData: {
    data: Job[];
    total: number;
  };
  filter: JobFilter;
  loading: boolean;
  onUpdateFilter: (key: keyof JobFilter, value: any) => void;
  getJobs: () => void;
  getJob: (id: number) => Promise<Job | null>;
  createJob: (body: Partial<Job>) => Promise<boolean>;
  updateJob: (id: number, body: Partial<Job>) => Promise<boolean>;
  deleteJob: (id: number) => void;
}

export const JobContext = createContext<JobContextState>({} as JobContextState);

export const useJobContext = () => useContext(JobContext);
