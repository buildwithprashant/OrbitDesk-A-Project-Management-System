const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (!result.success) {
    res.status(422);
    return next(result.error);
  }

  req.validated = result.data;
  next();
};

module.exports = validate;
