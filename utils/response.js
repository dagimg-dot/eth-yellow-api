function createLoginResponse({
  accessToken = null,
  user = null,
  message = "",
  success = false,
  errors = [],
}) {
  return {
    accessToken,
    message,
    success,
    errors,
    user,
  };
}

function createSignupResponse({
  user_id = null,
  message = "",
  success = false,
  errors = [],
}) {
  return {
    user_id,
    message,
    success,
    errors,
  };
}

function createUpdatePasswordResponse({
  message = "",
  success = false,
  errors = [],
}) {
  return {
    message,
    success,
    errors,
  };
}

module.exports = {
  createLoginResponse,
  createSignupResponse,
  createUpdatePasswordResponse,
};
