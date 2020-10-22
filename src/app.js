import React from 'react';
import ReactDOM from 'react-dom';
import SearchForm from './components/search-form';

// Render when document is ready
document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <SearchForm pubId={document.getElementById('search-bar').getAttribute('data-pubid')} />, document.getElementById('search-bar')
  );
});
