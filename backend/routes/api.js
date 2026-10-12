const router = require('express').Router();
const upload = require('../middleware/upload');
const ctrl = require('../controllers/analysisController');

router.post('/analyze', upload.single('resume'), ctrl.analyze);
router.get('/history', ctrl.getHistory);

module.exports = router;