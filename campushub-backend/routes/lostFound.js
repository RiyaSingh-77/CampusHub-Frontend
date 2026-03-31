const express = require('express');
const router  = express.Router();
const {
  getAllItems,
  createItem,
  deleteItem,
  resolveItem,
  uploadMiddleware,
} = require('../controllers/lostFoundController');

router.get('/',              getAllItems);
router.post('/', uploadMiddleware, createItem);  // multer parses FormData here
router.delete('/:id',        deleteItem);
router.patch('/:id/resolve', resolveItem);

module.exports = router;