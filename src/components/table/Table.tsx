import React from 'react';
import { DataGrid, GridColDef, GridRowIdGetter } from '@mui/x-data-grid';
import { Box, Pagination, PaginationItem, Typography, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Props {
  data: any[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  columns: GridColDef[];
  getRowId: GridRowIdGetter;
  onPageChange: (page: number) => void;
}

const Table = (props: Props) => {
  const {
    data, total, page, pageSize, onPageChange, ...rest
  } = props;
  const theme = useTheme();
  const totalPage = Math.ceil(total / pageSize);
  const getPagingInfo = () => {
    if (!total) {
      return '';
    }
    const from = page * pageSize + 1;
    const to = Math.min((page + 1) * pageSize, total);

    return `${from} - ${to} of ${total}`;
  };

  return (
    <Box
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography
        style={{
          height: 50,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            color: theme.palette.primary.main
          }}
        >
          {getPagingInfo()}
        </div>
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
      </Typography>
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
