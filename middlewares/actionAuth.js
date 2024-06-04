// Authorize action call

const actionAuth = (req, res, next) => {
  if (process.env.HASURA_ACTION_SECRET == req.headers["action_secret"]) {
    next();
  } else {
    res.json({
      success: false,
      message: "Unauthorized",
      errors: {
        message: "Unauthorized",
      },
    });
  }
};

module.exports = actionAuth;
