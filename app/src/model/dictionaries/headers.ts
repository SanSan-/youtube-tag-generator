import Header from '~types/classes/Header';

export const tagsCloudHeaders: Header[] = [
  new Header('Tag', 'tag')
];

export const tagsStatisticHeaders: Header[] = [
  new Header('Тег', 'tag', 350),
  new Header('Поисковый объём', 'volume', 125),
  new Header('Конкуренция', 'competition', 125),
  new Header('Оценка', 'rank', 125)
];
