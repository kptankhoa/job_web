import React from 'react';
import { DataGrid, GridColDef, GridRowIdGetter } from '@mui/x-data-grid';
import { Box, Pagination, PaginationItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Props {
  data: any[];
  page: number;
  totalPage: number;
  loading: boolean;
  columns: GridColDef[];
  getRowId: GridRowIdGetter;
  onPageChange: (page: number) => void;
}

const Table = (props: Props) => {
  const { data, page, totalPage, onPageChange, ...rest } = props;

  return (
    <Box
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          height: 50,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <Pagination
          count={totalPage}
          page={page + 1}
          onChange={(e, newPage) => onPageChange(newPage - 1)}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />
      </div>
      <div
        style={{ flex: 1 }}
      >
        <DataGrid
          rows={data}
          hideFooter
          {...rest}
        />
      </div>
    </Box>
  );
};

export default Table;
