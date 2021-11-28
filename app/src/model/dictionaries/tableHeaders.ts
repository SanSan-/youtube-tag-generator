export const tagsTableHeaders: Record<string, unknown>[] = [
  { header: 'Тег', key: 'tag', width: 50 }
];

export const statisticTableHeaders: Record<string, unknown>[] = [
  ...tagsTableHeaders,
  { header: 'Поисковый объём', key: 'volume', width: 20, style: { numFmt: '#,###' } },
  { header: 'Конкуренция', key: 'competition', width: 16, style: { numFmt: '0.0%' } },
  { header: 'Оценка', key: 'rank', width: 12, style: { numFmt: '0.0%' } }
];

export const statisticCondFormat: Record<string, unknown>[] = [
  {
    ref: 'B',
    rules: [
      {
        type: 'colorScale',
        cfvo: [{ type: 'num', value: 0 }, { type: 'num', value: 5000 }, { type: 'num', value: 100000 }],
        color: [{ argb: 'FFCB6967' }, { argb: 'FFFFFF65' }, { argb: 'FF00E668' }]
      }
    ]
  },
  {
    ref: 'C',
    rules: [
      {
        type: 'colorScale',
        cfvo: [{ type: 'num', value: 0 }, { type: 'num', value: 0.5 }, { type: 'num', value: 1 }],
        color: [{ argb: 'FF00E668' }, { argb: 'FFFFFF65' }, { argb: 'FFCB6967' }]
      }
    ]
  },
  {
    ref: 'D',
    rules: [
      {
        type: 'colorScale',
        cfvo: [{ type: 'num', value: 0 }, { type: 'num', value: 0.5 }, { type: 'num', value: 1 }],
        color: [{ argb: 'FFCB6967' }, { argb: 'FFFFFF65' }, { argb: 'FF00E668' }]
      }
    ]
  }
];
