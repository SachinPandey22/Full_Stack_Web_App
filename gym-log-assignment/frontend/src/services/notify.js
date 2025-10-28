import toast from 'react-hot-toast';

const KEY = 'notif_enabled';

export function getNotifEnabled() {
  const raw = localStorage.getItem(KEY);
  return raw === null ? true : raw === 'true';
}

export function setNotifEnabled(v) {
  localStorage.setItem(KEY, String(!!v));
}

function ifEnabled(fn) {
  return (...args) => {
    if (getNotifEnabled()) fn(...args);
  };
}
