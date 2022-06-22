class Product {
  static eventListenersAdded = false;

  constructor(id, name, price, description, image, myProductList) {
    if (!Product.eventListenersAdded) {
      this.addEventListeners();
    }

    if (typeof id !== 'number') { throw (new Error('id must be a number')) }
    this.userRole;
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.myProductList = myProductList;
    this.image = image;
  }
  render() {
    return `
          <div class="product" id="i${this.id}">
          <img src="${this.image}">
            <h3>${this.name}</h3>
            <div>${this.description}</div>
            <br>
            <p class="price">Price: ${this.price} kr &emsp; &emsp;</p>
              <form>
                <input type="number" value="1" class="quantity" min="1" max="100">
                <button type="submit" class="buyButton">Buy</button>
              </form>
          </div>
        `;
  }
  async getLogIn() {
    let loggedIn = await (await fetch('/api/login')).json();
    let userRole = loggedIn?.userRole;
    console.log(userRole)
    return userRole;

  }

  // A method that shows compact info about the product (in a list)
  async renderInList() {
    let user = await (await this.getLogIn());
    console.log(user);
    if (user == 'superadmin') {
      return `
          <div class="productInList" id="i${this.id}">
            <img src="${this.image}">
            <h3>${this.name}</h3>
            <p class="price">Price: ${this.price} kr</p>
            <form>
              <input type="number" value="1" class="quantity" min="1" max="100">
              <button type="submit" class="buyButton">Buy</button>
            </form>
            <button type="submit" class="deleteProduct">Delete this item</button>
          </div>
        `;
    } else
      return `
          <div class="productInList" id="i${this.id}">
            <img src="${this.image}">
            <h3>${this.name}</h3>
            <p class="price">Price: ${this.price} kr</p>
            <form>
              <input type="number" value="1" class="quantity" min="1" max="100">
              <button type="submit" class="buyButton">Buy</button>
            </form>
          </div>
        `;
      
    }
  
  addEventListeners() {

    listen('submit', '.productInList form, .product form', event => {
      // All web browser wants to reload the page on a form submit
      // (for historical reasons) - we don't want that so we ask
      // the browser to not perform it default action.
      event.preventDefault();

      // get the form element and then the quantity input field
      // - then read the quantity value
      let formElement = event.target;
      let quantityElement = formElement.querySelector('.quantity');
      let quantity = +quantityElement.value;

      // which product did the user click on?
      let productElement = event.target.closest('.productInList, .product');
      // read the id from the id attribute of the product div
      let id = +productElement.getAttribute('id').slice(1);
      // find the product we clicked on in this.products
      // by using the array method find
      let product = this.myProductList.products.find(product => product.id === id);
      this.myProductList.shoppingCart.add(quantity, product);
    });



    listen('click', '.productInList .deleteProduct', async event => {
      let productElement = event.target.closest('.productInList, .product');
      let id = +productElement.getAttribute('id').slice(1);
      console.log(id)

      try {
        test = await (await fetch('/api/products/' + id, {
          method: 'DELETE'
        })).json();
        console.log(test)
      }
      catch (ignore) { }

      location.reload();

    });


    Product.eventListenersAdded = true;
  }

}

if (typeof module === 'object' && module.exports) {
  module.exports = Product;

}
