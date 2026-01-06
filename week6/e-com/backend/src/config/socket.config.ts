import { registerAs } from '@nestjs/config';

export default registerAs('socket', () => ({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
}));