const response = (statusCode = 200, data = {}) => {
  return {
    statusCode,
    body: JSON.stringify(data),
  };
};

export const _400 = (data = {}) => {
  return response(400, data);
};

export const _401 = (data = {}) => {
  return response(401, data);
};

export const _402 = (data = {}) => {
  return response(402, data);
};

export const _403 = (data = {}) => {
  return response(403, data);
};

export const _404 = (data = {}) => {
  return response(404, data);
};

export const _405 = (data = {}) => {
  return response(405, data);
};

export const _500 = (data = {}) => {
  return response(500, data);
};

export const _501 = (data = {}) => {
  return response(501, data);
};

export const _502 = (data = {}) => {
  return response(502, data);
};

export const _200 = (data = {}) => {
  return response(200, data);
};
