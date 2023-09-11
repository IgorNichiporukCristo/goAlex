export const filtersIds = [
  'new',
  'new10',
  'popular',
  'day',
  'week',
  'month',
  'year',
  'allTime',
  'recommendations',
];

export const filters = {
  [filtersIds[0]]: {
    name: 'Свежее',
    event: 'NEW',
  },
  [filtersIds[1]]: {
    name: 'Рейтинг +10',
    event: 'NEW_TEN',
  },
  [filtersIds[2]]: {
    name: 'Популярное',
    event: 'POPULAR',
  },
  [filtersIds[3]]: {
    name: 'За день',
    event: 'DAY',
  },
  [filtersIds[4]]: {
    name: 'За неделю',
    event: 'WEEK',
  },
  [filtersIds[5]]: {
    name: 'За месяц',
    event: 'MONTH',
  },
  [filtersIds[6]]: {
    name: 'За год',
    event: 'YEAR',
  },
  [filtersIds[7]]: {
    name: 'За всё время',
    event: 'ALL_TIME',
  },
  [filtersIds[8]]: {
    name: 'Рекомендации',
    event: 'RECOMMENDATIONS',
  },
};
