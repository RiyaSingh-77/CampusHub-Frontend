const express = require('express');
const router = express.Router();
const {
  getAllItems,
  createItem,
  deleteItem,
  resolveItem
} = require('../controllers/lostFoundController');

router.get('/',           getAllItems);
router.post('/',          createItem);
router.delete('/:id',     deleteItem);
router.patch('/:id/resolve', resolveItem);

module.exports = router;