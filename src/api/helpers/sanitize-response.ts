const sensitiveFields = ['password'];
const sanitizeResponse = (dataObject: Record<string, any>) => {
  sensitiveFields?.forEach((field) => delete dataObject[field]);
  return dataObject;
};

export { sanitizeResponse };
