import React from 'react';
import { useJobContext } from 'context';
import { GridCellParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { PAGE_ROUTE } from 'constant';
import { Grid, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const ActionCell = ({ row }: GridCellParams) => {
  const { id } = row;
  const { deleteJob } = useJobContext();
  const navigate = useNavigate();
  const onEditClick = () => {
    navigate(PAGE_ROUTE.EDIT_JOB.replace(':id', id));
  };
  const onDeleteClick = () => deleteJob(id);

  return (
    <Grid container spacing={2}>
      <Grid item>
        <IconButton onClick={onEditClick}>
          <Edit fontSize="small" color="primary" />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton onClick={onDeleteClick}>
          <Delete fontSize="small" color="error" />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default ActionCell;
