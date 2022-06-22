function renderAddProductForm() {
  return `
     <h1>Add product</h1>
    <form name="addProduct">
      <label>
        <span>Product name:</span><input required minlength="2" name="name" type="text">
      </label>
      <label>
        <span>Description:</span><input required name="description" type="text">
      </label>
      <label>
        <span>Price:</span><input name="price" type="number">
      </label>
      <label>
        <span>Img Url:</span><input name="img_link" type="text">
      </label>
      <input type="submit" value="AddProduct">
    </form> `;
}

document.querySelector('body').addEventListener('submit', async (event) => {
  let target = event.target;

  if (!target.closest('form[name="addProduct"]')) { return; }

  event.preventDefault();

  let formElements = document.forms.addProduct.elements;
  let requestBody = {};
  for (let element of formElements) {
    if (element.type === 'submit') { continue; }
    requestBody[element.name] = element.value;
  }

  let result = {};
  try {
    result = await (await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })).json();
  }
  catch (ignore) { }

  if (!result.changes) {
    document.querySelector('.addProduct').innerHTML = `
      <h3>Something went wrong!</h3>
      <p>We could add product because of a technical problem.</p>
      <p>Please try again later!</p>
    `;
    return;
  }
  else {
    location.reload();
  }
});

document.querySelector('body').addEventListener('click', async (event) => {
  if (!event.target.closest('a[href="/addProduct"]')) { return; }
  event.preventDefault();
  let addproductDiv = document.querySelector('.addProduct');
  addproductDiv.innerHTML = renderAddProductForm();
  addproductDiv.classList.remove('hidden');
});