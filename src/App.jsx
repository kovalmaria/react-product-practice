/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category =
    categoriesFromServer.find(
      categorie => categorie.id === product.categoryId,
    ) || null;
  const user = usersFromServer.find(el => el.id === category.ownerId) || null;

  return {
    ...product,
    category,
    user,
  };
});

const DEFAULT_FILTER = 'All';

function getPreparedProducts(
  allProducts,
  { query, filterByUser, filterByCategory, sortBy, isReversed },
) {
  let preparedProducts = [...allProducts];

  if (filterByUser) {
    if (filterByUser !== DEFAULT_FILTER) {
      preparedProducts = preparedProducts.filter(
        prod => prod.user.name === filterByUser,
      );
    }
  }

  if (filterByCategory) {
    if (filterByCategory.length > 0) {
      preparedProducts = preparedProducts.filter(prod =>
        filterByCategory.includes(prod.category.title));
    }
  }

  if (query) {
    preparedProducts = preparedProducts.filter(prod =>
      prod.name.toLowerCase().includes(query.toLowerCase()));
  }

  if (sortBy) {
    switch (sortBy) {
      case 'id':
        preparedProducts.sort((prod1, prod2) => prod1.id - prod2.id);
        break;
      case 'product':
        preparedProducts.sort((prod1, prod2) =>
          prod1.name
            .toLowerCase()
            .localeCompare(prod2.name.toLowerCase()));
        break;
      case 'category':
        preparedProducts.sort((prod1, prod2) =>
          prod1.category.title
            .toLowerCase()
            .localeCompare(prod2.category.title.toLowerCase()));
        break;
      case 'user':
        preparedProducts.sort((prod1, prod2) =>
          prod1.user.name
            .toLowerCase()
            .localeCompare(prod2.user.name.toLowerCase()));
        break;
      default:
        break;
    }
  }

  if (isReversed) {
    preparedProducts.reverse();
  }

  return preparedProducts;
}

export const App = () => {
  const [query, setQuery] = useState('');
  const [filterByUser, setFilterByUser] = useState(DEFAULT_FILTER);
  const [filterByCategory, setFilterByCategory] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [isReversed, setIsReversed] = useState(false);

  const selectedCategory = category => {
    setFilterByCategory(prev =>
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]);
  };

  const visibleProducts = getPreparedProducts(products, {
    query,
    filterByUser,
    filterByCategory,
    sortBy,
    isReversed,
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setFilterByUser(DEFAULT_FILTER)}
                className={`${filterByUser === DEFAULT_FILTER && 'is-active'}`}
              >
                {DEFAULT_FILTER}
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={`${filterByUser === user.name && 'is-active'}`}
                  onClick={() => setFilterByUser(user.name)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => {
                    setQuery(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {query && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button is-success mr-6 ${filterByCategory.length > 0 && 'is-outlined'}`}
                onClick={() => setFilterByCategory([])}
              >
                {DEFAULT_FILTER}
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${filterByCategory.includes(category.title) && 'is-info'}`}
                  href="#/"
                  onClick={() => selectedCategory(category.title)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setFilterByCategory([]);
                  setFilterByUser(DEFAULT_FILTER);
                  setQuery('');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a
                        href="#/"
                        onClick={() =>
                          sortBy !== 'id'
                            ? setSortBy('id')
                            : setIsReversed(true)
                        }
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={`fas ${sortBy === '' ? 'fa-sort': 'fa-sort-up'}`}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a
                        href="#/"
                        onClick={() =>
                          sortBy !== 'product'
                            ? setSortBy('product')
                            : setIsReversed(true)
                        }
                      >
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a
                        href="#/"
                        onClick={() =>
                          sortBy !== 'category'
                            ? setSortBy('category')
                            : setIsReversed(true)
                        }
                      >
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a
                        href="#/"
                        onClick={() =>
                          sortBy !== 'user'
                            ? setSortBy('user')
                            : setIsReversed(true)
                        }
                      >
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={`${product.user.sex === 'm' ? 'has-text-link' : 'has-text-danger'}`}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
