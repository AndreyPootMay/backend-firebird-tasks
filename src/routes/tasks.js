const { Router } = require('express');
const router = Router();

const {
    findAll,
    findOne,
    insert,
    update,
    inactivate,
    reActivate
} = require('../services/TasksService');

router.get('/', findAll);

router.get('/:id', findOne);

router.post('/', insert);

router.put('/:id', update);

router.delete('/inactivate/:id', inactivate);

router.delete('/reActivate/:id', reActivate);


module.exports = router;