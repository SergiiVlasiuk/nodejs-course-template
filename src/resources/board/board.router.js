const router = require('express').Router();
const boardService = require('./board.service');
const taskService = require('../task/task.service');
const logger = require('../../common/logger');
const morganTokens = require('../../common/morgan-tokens');

router.get('/', morganTokens.board, async (req, res) => {
  try {
    const boards = await boardService.getAll();
    res.status(200).send(boards);
  } catch (error) {
    logger.error(error.stack);
  }
});
router.get('/:id', morganTokens.board, async (req, res) => {
  const { id } = req.params;
  try {
    const board = await boardService.getById(id);
    if (board) {
      res.status(200).send(board);
    } else {
      res.status(404).send('Not Found');
      logger.log({
        level: 'error',
        message: `Method: ${req.method} - Status: 404 - Error: Board Not Found! - id: ${id}, Url: ${req.originalUrl}\n`
      });
    }
  } catch (error) {
    logger.error(error.stack);
  }
});
router.post('/', morganTokens.board, async (req, res) => {
  const data = req.body;
  try {
    const board = await boardService.createBoard(data);
    res.status(200).send(board);
  } catch (error) {
    logger.error(error);
  }
});
router.put('/:id', morganTokens.board, async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const board = await boardService.updateById(id, data);
    if (board) {
      res.status(200).send(board);
    } else {
      res.status(404).send('Not Found');
      logger.log({
        level: 'error',
        message: `Method: ${req.method} - Status: 404 - Error: Board Not Found! - id: ${id}, Url: ${req.originalUrl}\n`
      });
    }
  } catch (error) {
    logger.error(error);
  }
});

router.delete('/:id', morganTokens.board, async (req, res) => {
  const { id } = req.params;

  try {
    await boardService.deleteById(id);
    await taskService.deleteBoardId(id);
    res.status(204).send('The board has been deleted');
  } catch (err) {
    res.status(404).send('Board not found');
    logger.log({
      level: 'error',
      message: `Method: ${req.method} - Status: 404 - Error: Board Not Found! - id: ${id}, Url: ${req.originalUrl}`
    });
  }
});

module.exports = router;
