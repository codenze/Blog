export default function timeDiff(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  const month = Math.floor(day / 30);
  const year = Math.floor(month / 12);

  if (year > 0) {
    return `${year} year${year === 1 ? '' : 's'} ago`;
  } else if (month > 0) {
    return `${month} month${month === 1 ? '' : 's'} ago`;
  } else if (day > 0) {
    return `${day} day${day === 1 ? '' : 's'} ago`;
  } else if (hr > 0) {
    return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  } else if (min > 0) {
    return `${min} minute${min === 1 ? '' : 's'} ago`;
  } else {
    return `${sec} second${sec === 1 ? '' : 's'} ago`;
  }
}
