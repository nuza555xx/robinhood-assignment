export const ErrorsCode = {
  REQUEST_URL_NOT_FOUND: {
    statusCode: 404,
    code: '1000',
    message: 'The requested URL was not found.',
  },
  MISSING_AUTHORIZATION_HEADERS: {
    statusCode: 401,
    code: '1001',
    message: 'Missing authorization header.',
  },
  MISSING_METADATA_HEADERS: {
    statusCode: 400,
    code: '1002',
    message: 'Missing metadata header.',
  },
  INVALID_ACCESS_TOKEN: {
    statusCode: 401,
    code: '1003',
    message: 'Invalid access token or expire.',
  },
  INVALID_REFRESH_TOKEN: {
    statusCode: 401,
    code: '1004',
    message: 'Invalid refresh token or expire.',
  },
  FORBIDDEN: {
    statusCode: 403,
    code: '1005',
    message: 'Can not access the data. Please try again.',
  },

  RATE_LIMIT_REQUEST: {
    statusCode: 429,
    code: '1006',
    message: `API rate limit exceeded. Please waiting.`,
  },
  USERNAME_OR_PASSWORD_INVALID: {
    statusCode: 400,
    code: '1007',
    message: 'Username or password is invalid. Please try again.',
  },
  USERNAME_IS_EXIST: {
    statusCode: 400,
    code: '1008',
    message: 'This username already exists. Please try again.',
  },
  SOMETHING_WRONG: {
    statusCode: 400,
    code: '1009',
    message: 'Sorry, Something went wrong. Please try again.',
  },
  NOT_FOUND_DATA: {
    statusCode: 404,
    code: '1010',
    message: 'Not fount data. Please try again.',
  },
  NOT_MATCH_PASSWORD: {
    statusCode: 400,
    code: '1011',
    message: 'Password is not matched. Please try again.',
  },
};
