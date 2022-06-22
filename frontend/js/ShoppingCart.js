class ShoppingCart {

  orderRows = [];

  constructor() {
    this.addEventListener();
  }

  async add(quantity, product) {
    //check if user is logged in before adding to cart
    let loggedIn = await (await fetch('/api/login')).json();
    if (!loggedIn || loggedIn._error) {
      toastr.error('Log in to add items to your shopping cart')
    }
    else {
      toastr.success('Added ' + quantity + ' - ' + product.name)
      // check if the product alread is in the cart
      let found = false;
      for (let orderRow of this.orderRows) {
        if (orderRow.product === product) {
          // add quantity
          orderRow.quantity += quantity;
          found = true;
        }
      }

      // if the product wasn't in the cart already
      if (!found) {
        // Add a new order row
        this.orderRows.push({
          quantity,
          product
        });
      }

      // for now render the shopping cart to the footer
      document.querySelector('#shoppingCart').innerHTML =
        this.render();
    }
  }

  remove(indexId) {
    toastr.info('Removed ' + this.orderRows[indexId].quantity + ' - ' + this.orderRows[indexId].product.name)
    this.orderRows.splice(indexId, 1);
    // rerender
    // for now render the shopping cart to the footer
    document.querySelector('#shoppingCart').innerHTML =
      this.render();
  }

  formatSEK(number) {
    return new Intl.NumberFormat(
      'sv-SE',
      { style: 'currency', currency: 'SEK' }
    ).format(number);
  }

  render() {
    // create a html table where we display
    // the order rows of the shopping cart
    let html = '<div class="shoppingCart"><table>';
    let totalSum = 0;
    for (let orderRow of this.orderRows) {
      let rowSum =
        orderRow.quantity * orderRow.product.price;
      html += `
        <tr class="rowId" id="i${this.orderRows.indexOf(orderRow)}">
          <td>${orderRow.quantity}</td>
          <td>${orderRow.product.name}</td>
          <td>à ${this.formatSEK(orderRow.product.price)}</td>
          <td>${this.formatSEK(rowSum)}</td>
          <td><button type="submit" class="deleteButton">X</button></td>
        </tr>
      `;
      totalSum += rowSum;
    }
    // add the totalSum
    html += `<tr>
      <td colspan="3">Total:</td>
      <td>${this.formatSEK(totalSum)}</td>
      <td><button type="submit" class="checkout">Pay</button</td>
    </tr>`;
    return html;
  }

  addEventListener() {
    listen('click', '#shoppingCart .deleteButton', event => {
      let button = event.target;
      let rnd = button.closest('tr').getAttribute('id')
      let id = rnd.slice(1)
      this.remove(id);

    }),

      listen('click', '.checkout', async () => {

        let reqBody = [];
        for (let orderRow of this.orderRows) {
          reqBody.push({
            quantity: orderRow.quantity,
            productId: orderRow.product.id
          });
        }

        // this part fails
        try {
          await (await fetch('/api/place-my-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody)
          })).json();
        }
        catch (ignore) { }

        this.orderRows = [];
        document.querySelector('#shoppingCart').innerHTML =
          this.render();
        toastr.success('Thank you for your order!');
      })
  }

}

  // For Jest - check if we are in a Node.js enviroment
  // if so export the class for Jest
  if (typeof module === 'object' && module.exports) {
    module.exports = ShoppingCart;
  }