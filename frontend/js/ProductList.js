class ProductList {
  constructor() {
    this.readDataFromDb();
    this.addEventListeners();
    this.shoppingCart = new ShoppingCart();
  }

  async readDataFromDb() {
    let rawData = await fetch('/api/products')
    let data = await rawData.json()
    this.products = []
    for (let element of data) {
      let aProduct = new Product(element.id, element.name, element.price, element.description, element.img_link, this);

      this.products.push(aProduct);
    }
    document.querySelector('main').innerHTML = await this.render()
  }

  async render() {
    // Create the variable html - an empty string
    let html = '<h2>Click on a product name to see product details.</h2>';
    // Loop through all products and add the html
    // for each product to the html variable
    for (let product of this.products) {
      html += await product.renderInList();
    }
    // Return html for all the products
    return html;
  }

  addEventListeners() {

    // Add a click event handler for a product in a list
    listen('click', '.productInList h3', event => {
      // which product did the user click on?
      let productElement = event.target.closest('.productInList');

      // read the id from the id attribute of the product div
      let id = +productElement.getAttribute('id').slice(1);

      // find the product we clicked on in this.products
      // by using the array method find
      let product = this.products.find(product => product.id === id);

      // replace the content in the main element with the
      // detailed html for the product
      document.querySelector('main').innerHTML = `
            <button class="backButton">
              Back to product list
            </button>`
        + product.render();
    });

    // Add an event listener for the back button
    listen('click', '.backButton', () => {
      // replace the contents of main with the product list
      document.querySelector('main').innerHTML = this.render();
    });
  }
}

// For Jest - check if we are in a Node.js enviroment
// if so export the class for Jest
if (typeof module === 'object' && module.exports) {
  module.exports = ProductList;
}
