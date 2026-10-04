const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/** Format an ISO date the way the original blog rendered it. */
export function formatDate(date) {
  const d = new Date(date);
  const cst = new Date(d.getTime() + 8 * 60 * 60 * 1000);
  return `${cst.getUTCFullYear()}年${cst.getUTCMonth() + 1}月${cst.getUTCDate()}日`;
}

/** ISO-ish string suitable for a <time datetime> attribute. */
export function isoDate(date) {
  return new Date(date).toISOString();
}

export function weekday(date) {
  const d = new Date(new Date(date).getTime() + 8 * 60 * 60 * 1000);
  return WEEKDAYS[d.getUTCDay()];
}

export function formatDateFull(date) {
  return `${weekday(date)} ${formatDate(date)}`; // kept for compatibility
}
