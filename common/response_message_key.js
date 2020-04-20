/*
 *---------------------------------------------------------------------------
 * File Name      : response_message_key.js
 * File Code      : UTF-8
 * Create Date    : July/04/2017
 * Copyright      : 2017 by GCS.
 *---------------------------------------------------------------------------
 * ver 1.0.0      :July/04/2017 hoanxh new create
 *---------------------------------------------------------------------------
 * history        :
 *---------------------------------------------------------------------------
 */


/**
 * config information constant
 */
var messageKey = {
  'AUTH': {
    'AUTH_INVALID': {
      'HTTP_CODE': 401,
      'CODE': 40101
    },
    'TOKEN_INVALID': {
      'HTTP_CODE': 403,
      'CODE': 40301
    },
    'TOKEN_EXPIRED': {
      'HTTP_CODE': 403,
      'CODE': 40302
    },
    "TOKEN_NOT_FOUND": {
      'HTTP_CODE': 403,
      'CODE': 40303
    },
    'USER_NOT_FOUND': {
      'HTTP_CODE': 404,
      'CODE': 40410
    }
  },
  'USER': {
    'EMAIL_EXIST': {
      'HTTP_CODE': 400,
      'CODE': 40010
    },
    'USERNAME_EXIST': {
      'HTTP_CODE': 400,
      'CODE': 40010
    },
    'NICKNAME_EXIST': {
      'HTTP_CODE': 400,
      'CODE': 40010
    },
    'CAMERA_EXIST': {
      'HTTP_CODE': 400,
      'CODE': 40010
    },
    'UNKNOWN': {
      'HTTP_CODE': 400,
      'CODE': 40011
    }
  },
  'ERROR_SERVER': {
    'HTTP_CODE': 500,
    'CODE': 50001
  },
  'COMMON': {
    'SUCCESSFULLY': {
      'HTTP_CODE': 200
    },
    'INVALID_PARAMETER': {
      'HTTP_CODE': 400,
      'CODE': 40006
    },
    'MISSING_DATA': {
      'HTTP_CODE': 400,
      'CODE': 40007
    },
    'NOT_FOUND': {
      'HTTP_CODE': 404,
      'CODE': 40401
    },
    'NO_FILE_PASS': {
      'HTTP_CODE': 404,
      'CODE': 40401
    },
    'NO_PERMISSION': {
      'HTTP_CODE': 406,
      'CODE': 40601
    },
    'INVALID_DATA': {
      'HTTP_CODE': 400,
      'CODE': 40010
    },
    "CREATE_SUCCESS": {
      'HTTP_CODE': 200
    },
    "UPDATE_SUCCESS": {
      'HTTP_CODE': 200
    },
    "DELETE_SUCCESS": {
      'HTTP_CODE': 200
    },
    "GET_SUCCESS": {
      'HTTP_CODE': 200
    },
    "FAIL": {
      "HTTP_CODE": 400,
      "CODE": 40020
    }
  },

};
module.exports = messageKey;