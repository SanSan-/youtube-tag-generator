export const tagsTableHeaders: Record<string, unknown>[] = [
  { header: 'Тег', key: 'tag', width: 60 }
];

export const statisticTableHeaders: Record<string, unknown>[] = [
  ...tagsTableHeaders,
  { header: 'Поисковый объём', key: 'volume', width: 17, style: { numFmt: '#,###' } },
  { header: 'Конкуренция', key: 'competition', width: 14, style: { numFmt: '0.0%' } },
  { header: 'Оценка', key: 'rank', width: 10, style: { numFmt: '0.0%' } }
];
