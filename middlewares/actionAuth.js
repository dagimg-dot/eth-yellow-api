// authorize action call
export const actionAuth = (req, res, next) => {
  if (process.env.HASURA_ACTION_SECRET == req.headers["action_secret"]) next();
  else
    res.send({
      invalid_path: "not_permitted_in_this_path",
    });
};
