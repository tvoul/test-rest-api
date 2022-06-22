const passwordEncryptor = require('./passwordEncryptor');

module.exports = function (app, runQuery, db) {

  app.get('/api/my-orders', (req, res) => {

    let userId = req.session.user?.id;

    runQuery('my-orders', req, res, { customerId: userId }, `
      SELECT * FROM orderDetails WHERE customerId = :customerId ORDER BY orderId
    `);

  });

  app.post('/api/place-my-order', (req, res) => {

    // get the id of the logged in user
    let userId = req.session.user?.id;

    //Read the request.body 
    //Exepcted to be an array of objects
    //{product_id:x, num_of_products: Y}
    let orderRows = req.body;

    if (!(orderRows instanceof Array)) {
      res.json({ _error: 'The request should be an array!' });
      return;
    }

    let result = runQuery('place-my-order', req, null, { userId },
      `INSERT INTO orders(customer_id) VALUES (:userId)`
    );

  
    let orderId = result.lastInsertRowid;

    for (let orderRow of orderRows) {
     runQuery('place-my-order', req, null, { ...orderRow, orderId },
        `INSERT INTO ordersXproducts (order_id, product_id, num_of_products) 
         VALUES (:orderId, :productId, :quantity)`);
   
    }

    res.json({ orderId, status: 'Created the order' });

  });



  function editMyUserInfo(req, res) {

    delete req.body.userRole;

    let userId = req.session.user?.id;

    let queryParameters = { ...req.body, id: userId };

    if (queryParameters.password) {
      queryParameters.password = passwordEncryptor(queryParameters.password);
    }

    // If you knew about this route
    // you could elevated your userRole directly because it lacked
    delete req.body.userRole;

    runQuery('edit-my-user-info', req, res, queryParameters, `
        UPDATE customers
        SET ${Object.keys(req.body).map(x => x + ' = :' + x)}
        WHERE id = :id
    `);

    let stmt = db.prepare('SELECT * FROM customers WHERE id = :id');
    let updatedUserInfo = stmt.all({ id: queryParameters.id })[0];
    delete updatedUserInfo.password;
    req.session.user = updatedUserInfo;
  }
  app.put('/api/edit-my-user-info', editMyUserInfo);
  app.patch('/api/edit-my-user-info', editMyUserInfo);

}
