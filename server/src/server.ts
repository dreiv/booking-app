import app from './app';
import { env } from './config/env';

const port = Number(env.PORT) || 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${port} in ${env.NODE_ENV} mode`);
});
