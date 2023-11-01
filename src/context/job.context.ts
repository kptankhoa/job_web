import { createContext, useContext } from 'react';
import { Job, JobFilter } from 'constant';

export interface JobContextState {
  filter: JobFilter;
  data: Job[];
  selectedJob: Job | null;
  loading: boolean;
  getJobs: () => void;
  getJob: (id: number) => void;
  createJob: (body: any) => void;
  updateJob: (id: number, body: any) => void;
  deleteJob: (id: number) => void;
  setSelectedJob: (job: Job) => void;
}

export const JobContext = createContext<JobContextState>({} as JobContextState);

export const useJobContext = () => useContext(JobContext);
