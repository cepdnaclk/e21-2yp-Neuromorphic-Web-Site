// middleware/sanitize.js
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return;

  // iterate over keys snapshot because we may add/delete keys
  for (const originalKey of Object.keys({ ...obj })) {
    const value = obj[originalKey];

    // if key contains $ or . replace them with underscore
    if (originalKey.includes('$') || originalKey.includes('.')) {
      const cleanKey = originalKey.replace(/\$/g, '_').replace(/\./g, '_');
      // if the cleanKey already exists, keep it but still sanitize its value
      if (!Object.prototype.hasOwnProperty.call(obj, cleanKey)) {
        obj[cleanKey] = value;
      } else {
        // merge/overwrite if you prefer
        obj[cleanKey] = value;
      }
      delete obj[originalKey];
      // continue sanitizing moved value
      sanitizeObject(obj[cleanKey]);
    } else {
      // recurse into nested objects/arrays
      if (typeof value === 'object' && value !== null) {
        sanitizeObject(value);
      }
    }
  }
}

module.exports = function reqSanitizer(req, res, next) {
  try {
    sanitizeObject(req.body);
    sanitizeObject(req.params);
    // mutate req.query's properties — do NOT assign req.query = ...
    sanitizeObject(req.query);
  } catch (err) {
    // don't let sanitizer crash your app
    return next(err);
  }
  next();
};
