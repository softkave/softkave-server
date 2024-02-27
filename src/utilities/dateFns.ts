import {format} from 'date-fns';

export function formatDateTime(date: number | string | Date) {
  return format(new Date(date), 'MMM d yyyy, H:mm a');
}
