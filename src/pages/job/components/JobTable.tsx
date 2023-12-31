import React from 'react';
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { formatDateForShow } from 'utils';
import { Table } from 'components';
import { useJobContext } from 'context';
import { defaultColDef, JobFilter } from 'constant';
import ActionCell from './ActionCell';

const getColumns = ({ page, size }: JobFilter): GridColDef[] => [
  {
    ...defaultColDef,
    field: 'no',
    headerName: 'No.',
    width: 90,
    type: 'number',
    valueGetter: ({ api, row }: GridValueGetterParams) => page * size + api.getRowIndexRelativeToVisibleRows(row.id) + 1

  },
  {
    ...defaultColDef,
    field: 'title',
    headerName: 'Job Title',
    flex: 1
  },
  {
    ...defaultColDef,
    field: 'description',
    headerName: 'Description',
    flex: 1.2
  },
  {
    ...defaultColDef,
    field: 'expiryDate',
    headerName: 'Expiry Date',
    flex: 0.8,
    valueGetter: ({ row }: GridValueGetterParams) => formatDateForShow(row.expiryDate)
  },
  {
    ...defaultColDef,
    field: 'createdAt',
    headerName: 'Created At',
    flex: 0.8,
    valueGetter: ({ row }: GridValueGetterParams) => formatDateForShow(row.createdAt)
  },
  {
    ...defaultColDef,
    field: 'updatedAt',
    headerName: 'Updated At',
    flex: 0.8,
    valueGetter: ({ row }: GridValueGetterParams) => formatDateForShow(row.updatedAt)
  },
  {
    ...defaultColDef,
    field: 'action',
    headerName: 'Action',
    flex: 0.8,
    renderCell: (params) => <ActionCell {...params} />
  }
];

const JobTable = () => {
  const {
    jobData: { data, total },
    filter,
    loading,
    onUpdateFilter
  } = useJobContext();
  const columns = getColumns(filter);

  return (
    <Table
      data={data}
      total={total}
      page={filter.page}
      pageSize={filter.size}
      loading={loading}
      columns={columns}
      getRowId={(row) => row.id}
      onPageChange={(page) => onUpdateFilter('page', page)}
    />
  );
};

export default JobTable;
