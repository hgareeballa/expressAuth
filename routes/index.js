var { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var express = require('express');
var router = express.Router();
var getProducts = require('../lib/db')
var hash = require('pbkdf2-password')()

/* GET home page. */
router.get('/', async function (req, res, next) {
  res.render('login');

  // console.log('get products');
  // const products = await getProducts()
  // console.log('print products');
  // console.log('response back ');
  // res.render('index', { products });
});

/* GET home page. */
router.get('/home', restrict, async function (req, res, next) {

  console.log('get products');
  const products = await getProducts()
  console.log('print products');
  console.log('response back ');
  res.render('index', { products });
});


router.get('/about', restrict, async function (req, res, next) {
  console.log('get products');
  const products = await getProducts()
  console.log('print products');
  console.log('response back ');
  res.render('about');
});

router.get('/users', restrict, async function (req, res, next) {
  console.log('get products');
  const products = await getProducts()
  // console.log('print products', products);
  console.log('response back ');
  //res.render('users', { products });
  res.render('users', { products });
});





router.get('/api/getusers', restrict, async function (req, res, next) {
  console.log('get products');
  const products = await getProducts()
  // console.log('print products', products);
  console.log('response back ');
  res.json(products)
});



router.get('/user', restrict, async (req, res) => {
  const posts = await prisma.user.findMany()
  res.json(posts)
})

router.post('/user', restrict, async (req, res) => {
  const result = await prisma.user.create({
    data: {
      ...req.body,
    },
  })
  res.json(result)
})


router.get('/login', function (req, res) {
  console.log('displau login ');
  res.render('login');
});

router.post('/login', function (req, res, next) {
  console.log('-----check login-------');
  authenticate(req.body.username, req.body.password, function (err, user) {
    if (err) return next(err)
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function () {
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect('/home');
      });
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.'
        + ' (use "tj" and "foobar")';
      res.redirect('/login');
    }
  });
});

router.get('/restricted', restrict, function (req, res) {
  res.redirect('/home')
  //res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});


router.get('/logout', function (req, res) {
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function () {
    res.redirect('/');
  });
});

module.exports = router;

// Authenticate using our plain-object database of doom!

function authenticate(name, pass, fn) {
  console.log('User:', name);
  console.log('Pass:', pass);
  //if (!module.parent) 
  console.log('authenticating %s:%s', name, pass);
  var user = users[name];
  // query the db for the given username
  if (!user) return fn(null, null)
  // apply the same algorithm to the POSTed password, applying
  // the hash against the pass / salt, if there is a match we
  // found the user
  return fn(null, user)
  // hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
  //   if (err) return fn(err);
  //   if (hash === user.hash) return fn(null, user)
  //   fn(null, null)
  // });
}

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}


// dummy database

var users = {
  tj: { name: 'Hassan tj' },
  mo: { name: 'Ahmed Mo' }
};

