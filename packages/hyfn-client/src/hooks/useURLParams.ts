export const useURLParams = () => {
  const params = new URLSearchParams(window.location.search);
  const crumbsMaker = (fn: (params: URLSearchParams) => any) => {
    const urlParams = new URLSearchParams();
    return fn(urlParams);
  };
  return { location, params, crumbsMaker };
};
