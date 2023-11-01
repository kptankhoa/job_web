export interface JobFilter {
  page: number;
  size: number;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
