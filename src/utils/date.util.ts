import moment from 'moment';

export const formatDateForShow = (date: Date | null): string => {
  if (!date) {
    return '';
  }

  return moment(date).format('DD/MM/yyyy');
};
