import supertest from 'supertest';

import { SetupServer } from '@src/server';

const server = new SetupServer();
beforeAll(async () => {
  await server.init();

  global.testRequest = supertest(server.getApp());
});

afterAll(async () => {
  await server.close();
});
