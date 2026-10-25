const express = require('express');
const { createProducerRepository } = require('./repositories/producerRepository');
const { createProducersRouter } = require('./routes/producers');

function createApp(db) {
  const app = express();
  app.disable('x-powered-by');

  app.use('/producers', createProducersRouter(createProducerRepository(db)));

  app.use((req, res) => {
    res.status(404).json({ error: 'Resource not found' });
  });

  // Express identifies error handlers by their 4-argument signature.
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
