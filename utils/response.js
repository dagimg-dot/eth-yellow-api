function createLoginResponse({
  accessToken = null,
  message = "",
  success = false,
  errors = [],
}) {
  return {
    accessToken,
    message,
    success,
    errors,
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

module.exports = {
  createLoginResponse,
  createSignupResponse,
};
