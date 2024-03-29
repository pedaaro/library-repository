import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import Book from './book.js';
import NewBooks from './newBooks.js';
import { client } from './axios.config.js';
// import Sidebar from './COMPONENTS/sidebar.js';

function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    client.get("/api/books")
      .then(response => {
        if (Array.isArray(response.data)) {
          setBooks(response.data);
        } else {
          console.error('Received data is not an array:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const [sortBy, setSortBy] = React.useState('');
  const sortedBooks = [...books];

  if (sortBy === 'author') {
    sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
  } else if (sortBy === 'title') {
    sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <section>
      <div className='heading-header'>
        <h1 className='heading-title'>
          Online Public Library
        </h1>
      </div> 
      <section> 
        {/* <div>
          <Sidebar />
        </div> */}

        <div id='book-suggestions' className='book-suggestions-div'>
          <NewBooks />
        </div>

        <div className='sort-by-div'>
          <select className='sort-by-select' onChange={(e) => setSortBy(e.target.value)}>
            <option key="reorder" value="">Reorder</option>
            <option key="author" value="author">Author (a-z)</option>
            <option key="title" value="title">Title (a-z)</option>
          </select>
        </div>

        
        <div className='booklist'>
          {sortedBooks.map(book => (
            <Book
              key={book.id} // Unique key based on book's id
              id={book.id}
              img={book.img}
              title={book.title}
              author={book.author}
              audio={book.audio}
              written={book.written}
              // favorite={book.favorite}
            />
          ))}
        </div>
      </section>
    </section>
  );
  
}

createRoot(document.getElementById('root')).render(<BookList />);