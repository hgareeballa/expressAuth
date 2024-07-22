var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:id', async function (req, res, next) {
    const productId = parseInt(req.params.id);
    //console.log('IDDDDDDDDDDDDDDDDDDDL:', productId);
    res.render('product', { id: productId });

});

module.exports = router;
