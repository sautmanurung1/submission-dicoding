const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Generate a unique ID for the new book
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    createdAt,
    updatedAt,
  };

  // Validation checks
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Failed to add book. Please provide a book name.',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Failed to add book. readPage cannot be greater than pageCount.',
    }).code(400);
  }

  // Add the new book to the list
  books.push(newBook);

  return h.response({
    status: 'success',
    message: 'Book added successfully.',
    data: {
      bookId: id,
    },
  }).code(201);
};

const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  // Filter books based on query parameters
  let filteredBooks = books;

  if (name !== undefined) {
    filteredBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  } else if (reading !== undefined) {
    filteredBooks = books.filter((book) => book.reading === !!Number(reading));
  } else if (finished !== undefined) {
    filteredBooks = books.filter((book) => book.finished === !!Number(finished));
  }

  // Prepare the response
  if (filteredBooks.length === 0) {
    return h.response({
      status: 'success',
      data: {
        books: [],
      },
    }).code(200);
  }

  const simplifiedBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return h.response({
    status: 'success',
    data: {
      books: simplifiedBooks,
    },
  }).code(200);
};

const getBookById = (request, h) => {
  const { bookId } = request.params;

  // Find the book by ID
  const book = books.find((book) => book.id === bookId);

  if (book) {
    return h.response({
      status: 'success',
      data: {
        book,
      },
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Book not found.',
  }).code(404);
};

const updateBookById = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  // Validation checks
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Failed to update book. Please provide a book name.',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Failed to update book. readPage cannot be greater than pageCount.',
    }).code(400);
  }

  // Find the book by ID
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    // Update the book's information
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    return h.response({
      status: 'success',
      message: 'Book updated successfully.',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Failed to update book. ID not found.',
  }).code(404);
};

const deleteBookById = (request, h) => {
  const { bookId } = request.params;

  // Find the book by ID
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    // Remove the book from the list
    books.splice(index, 1);
    return h.response({
      status: 'success',
      message: 'Book deleted successfully.',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Failed to delete book. ID not found.',
  }).code(404);
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};