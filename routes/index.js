var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

router.get('/', csrfProtection, function(req, res, next) {
  res.render('index', { csrfToken: req.csrfToken() });
});

module.exports = router;
