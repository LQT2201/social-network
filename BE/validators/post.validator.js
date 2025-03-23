const Joi = require("joi");
const { BadRequestError } = require("../core/error.response");

const postSchema = Joi.object({
  content: Joi.string().required().max(5000),
  tags: Joi.array().items(Joi.string()),
  visibility: Joi.string().valid("public", "private", "followers"),
  location: Joi.object({
    name: Joi.string(),
    coordinates: Joi.array().items(Joi.number()).length(2),
  }),
  poll: Joi.object({
    question: Joi.string(),
    options: Joi.array().items(Joi.string()).min(2).max(4),
    endDate: Joi.date().greater("now"),
  }),
});

const validatePost = async (req, res, next) => {
  try {
    await postSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

module.exports = { validatePost };
