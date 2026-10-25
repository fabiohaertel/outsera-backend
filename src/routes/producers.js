const express = require('express');

function methodNotAllowed(allowed) {
  return (req, res) => {
    res.set('Allow', allowed).status(405).json({ error: `Method ${req.method} not allowed` });
  };
}

function createProducersRouter(producerRepository) {
  const router = express.Router();

  router
    .route('/award-intervals')
    .get((req, res) => {
      res.status(200).json(producerRepository.findAwardIntervals());
    })
    .all(methodNotAllowed('GET, HEAD'));

  return router;
}

module.exports = { createProducersRouter };
