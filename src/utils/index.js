export const getStorage = (key) => {
  return window.localStorage.getItem(key);
};

export const setStorage = (key, value) => {
  return window.localStorage.setItem(key, value);
};
