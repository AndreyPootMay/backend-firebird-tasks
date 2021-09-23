const { Router } = require('express');
const router = Router();

const { findAll, findOne, insert } = require('../services/TasksService');

router.get('/', findAll);
router.get('/:id', findOne);

router.post('/', insert);


module.exports = router;