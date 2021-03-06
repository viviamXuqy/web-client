/**
 * Store localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content); // eslint-disable-line no-param-reassign
  }
  window.localStorage.setItem(name, content);
};

/**
 * Get localStorage
 */
export const getStore = name => {
  if (!name) return '';
  return window.localStorage.getItem(name);
};

/**
 * Delete localStorage
 */
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
};
