'use strict';

const express = require('express');
const {get} = require('./functions');

const router = new express.Router();

router.get('/:roomId', get);

module.exports = router;
