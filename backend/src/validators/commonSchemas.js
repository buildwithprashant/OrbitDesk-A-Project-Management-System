const { z } = require('zod');

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');
const optionalDate = z.coerce.date().optional();
const requiredDate = z.coerce.date();

module.exports = { z, objectId, optionalDate, requiredDate };
