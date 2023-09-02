const bookList = document.querySelector('.book-list');
const cartItemsList = document.querySelector('.cart-items');

let cart = [];
let bookData;

// Logic to fetch book data
async function fetchBookData() {
  try {
    const response = await fetch('http://localhost:3000/books');
    bookData = await response.json();

    renderBookList(bookData);
    updateCartUI();
  } catch (error) {
    console.error('Error fetching book data:', error);
  }
}

// Render the book list
function renderBookList(bookData) {
  bookList.innerHTML = '';
  bookData.forEach(book => {
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book');
    bookDiv.innerHTML = `
      <h3>${book.title}</h3>
      <img src="${book.image}" alt="${book.title}" class="book-image">
      <p>$${book.price.toFixed(2)}</p>
      <button class="add-to-cart" onclick="addToCart(${book.id})">Add to Cart <ion-icon name="cart-outline"></ion-icon></button>
    `;
    bookList.appendChild(bookDiv);
  });
}
  // Logic to add to cart
async function addToCart(id) {
  const response = await fetch('http://localhost:3000/books');
  bookData = await response.json();
  console.log(bookData);
 const selectedBook = bookData.find(book => book.id === id);
  if (selectedBook) {
  cart.push(selectedBook);
     await updateCartOnServer(selectedBook);

     updateCartUI();
   }
}

// Logic to remove book from cart
async function removeFromCart(bookId) {
  cart = cart.filter(book => book.id !== bookId);

  await updateCartOnServer(cart);

  await
  updateCartUI();
}

// Logic to update cart UI
async function updateCartUI() {
  const response = await fetch('http://localhost:3000/cart');
  cart = await response.json();
  cartItemsList.innerHTML = '';
  cart.forEach(item => {
    const cartItem = document.createElement('li');
    cartItem.innerHTML = `
      ${item.title} - $${item.price.toFixed(2)}
      <button class="remove-from-cart" onclick="deleteFromCart(${item.id})">Remove <ion-icon name="trash-outline"></ion-icon></button>
    `;
    cartItemsList.appendChild(cartItem);
  });
}

  // logic to update cart on server
async function updateCartOnServer(updatedCart) {
  const {id,...product}=updatedCart
  try {
    await fetch('http://localhost:3000/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
  } catch (error) {
    console.error('Error updating cart on server:', error);
  }
}

// Initialize the app
fetchBookData();

//Logic to delete from cart
async function deleteFromCart(id) {
  try {
    await fetch(`http://localhost:3000/cart/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error updating cart on server:', error);
  }}