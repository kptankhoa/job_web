import queryString from 'query-string';
import { Job, JobFilter } from 'constant';
import { axiosInstance } from 'config';
import { convertToJob } from 'utils';
import {
  StatusCodes,
} from 'http-status-codes';

export interface JobResponse {
  id: number;
  title: string;
  description: string;
  expiryDate: string; // iso string
  createdAt: string; // iso string
  updatedAt: string; // iso string
}

export interface JobListResponse {
  data: JobResponse[];
  total: number;
}

export const getJobsApi = async (filter: JobFilter): Promise<{ data: Job[], total: number }> => {
  try {
    const query = queryString.stringify(filter);
    const endpoint = `/jobs?${query}`;
    const res = await axiosInstance.get<JobListResponse>(endpoint);
    const { total, data } = res.data;

    return {
      total,
      data: data.map(convertToJob)
    };
  } catch (e) {
    console.log(e);

    return {
      data: [],
      total: 0
    };
  }
};

export const getJobApi = async (id: number): Promise<Job | null> => {
  try {
    const endpoint = `/jobs/${id}`;
    const res = await axiosInstance.get<JobResponse>(endpoint);

    return convertToJob(res.data);
  } catch (e) {
    console.log(e);

    return null;
  }
};

export const createJobApi = async (body: any): Promise<boolean> => {
  try {
    const endpoint = '/jobs';
    const json = JSON.stringify(body);
    const res = await axiosInstance.post<JobResponse>(endpoint, json);

    return res.status === StatusCodes.CREATED;
  } catch (e) {
    console.log(e);

    return false;
  }
};

export const updateJobApi = async (id: number, body: any): Promise<boolean> => {
  try {
    const endpoint = `/jobs/${id}`;
    const json = JSON.stringify(body);
    const res = await axiosInstance.put(endpoint, json);

    return res.status === StatusCodes.NO_CONTENT;
  } catch (e) {
    console.log(e);

    return false;
  }
};

export const deleteJobApi = async (id: number): Promise<boolean> => {
  try {
    const endpoint = `/jobs/${id}`;
    const res = await axiosInstance.delete(endpoint);

    return res.status === StatusCodes.NO_CONTENT;
  } catch (e) {
    console.log(e);

    return false;
  }
};
