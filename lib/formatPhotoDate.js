import { boothCopy } from '@/data/data';

export function formatPhotoDate(date = new Date()) {
  return new Intl.DateTimeFormat(boothCopy.dateLocale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
    .format(date)
    .toUpperCase();
}
