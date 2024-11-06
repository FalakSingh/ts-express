import { saveMultipartFiles } from './save-multipart-files';
import { parseFileNames } from './parse-file-names';

const handleUploadedFiles = [saveMultipartFiles, parseFileNames];

export { ErrorHandler } from './error-handler';
export { catchAsync } from './catch-async';
export { defaultMiddleware } from './default-middleware';
export { validateToken } from './validate-token';
export { sanitizePayload } from './sanitize-payload';

export { handleUploadedFiles };
