import dev from './dev.js';
import prod from './prod.js';

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
export default env === 'production' ? prod : dev;
