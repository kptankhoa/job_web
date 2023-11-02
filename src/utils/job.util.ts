import { Job } from 'constant';

export const convertToJob = (data: any): Job => ({
  ...data,
  expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
  createdAt: new Date(data.createdAt),
  updatedAt: new Date(data.updatedAt)
});

export const prepareJobForApiCall = (data: Partial<Job>): any => ({
  title: data.title,
  description: data.description,
  expiryDate: data.expiryDate?.toISOString() || null
});
