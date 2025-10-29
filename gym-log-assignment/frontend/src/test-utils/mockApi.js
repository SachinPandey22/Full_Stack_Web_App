export const ok = (data) => Promise.resolve({ data });
export const fail = (detail = 'Error') => {
  const err = new Error(detail);
  err.response = { data: { detail } };
  return Promise.reject(err);
};
