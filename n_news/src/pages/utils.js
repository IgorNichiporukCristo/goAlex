import React from "react";

export const NAMEOFMONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июня', 'июля', 'авг', 'сен', 'окт', 'ноя', 'дек'];

export const LONGNAMEMONTHS = ['Января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

export const DAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

export const getTodayDate = () => {
  var d = new Date();
  return(`${add_zero(d.getDate())} ${LONGNAMEMONTHS[(d.getMonth())]} ${d.getFullYear()}, ${DAYS[d.getDay()]}`)
}

export function add_zero(str) {
  str = String(str);
  if (str.length === 1) return "0" + str;
  return str;
}

export const formattingParamsDate = ({ year, month, date, hours: hour, minutes }) => (
  formatDate(
    {
      year,
      month,
      date,
    },
    {
      hour,
      minutes,
    }
  )
);

export function formatDate({ date, month, year }, { hour, minutes }) {
  const publicationDate = new Date(year, month - 1, date, hour, minutes);
  const now = new Date();

  const diff = Math.floor((now - publicationDate) / 1000);

  switch (true) {
    case diff < 60:
      return 'Менее минуты назад';
    case Math.floor(diff / 60) < 60:
      return `${Math.floor(diff / 60)} мин. назад`;
    case Math.floor(diff / 60 / 60) < 4:
      return `${Math.floor(diff / 60 / 60)} ч. назад`;
    case Math.floor(diff / 60 / 60) < 24 && publicationDate.getDate() === now.getDate():
      return `Сегодня в ${add_zero(hour)}:${add_zero(minutes)}`;
    case Math.floor(diff / 60 / 60) < 48 && publicationDate.getDate() + 1 === now.getDate():
      return `Вчера в ${add_zero(hour)}:${add_zero(minutes)}`;
    case publicationDate.getFullYear() === now.getFullYear():
      return `${add_zero(date)} ${NAMEOFMONTHS[Number(month) - 1]} в ${add_zero(hour)}:${add_zero(minutes)}`
    default:
      return `${add_zero(date)} ${NAMEOFMONTHS[Number(month) - 1]} ${year} в ${add_zero(hour)}:${add_zero(minutes)}`
  }
}

export const formattedText = (text) => {
  return text
    .replace(/_([a-zA-Zа-яёА-ЯЁ|0-9|\s]+)_/g, (match) => (
      match.match(/([a-zA-Zа-яёА-ЯЁ|0-9|\s]+)/g)[0]
    ))
    .replace(/(###|\n\n)/g, " ");
};
