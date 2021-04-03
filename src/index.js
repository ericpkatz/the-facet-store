import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Link } from 'react-router-dom';
import Facet from './Facet';


const App = (props)=> {
  const [products, setProducts] = useState([]);
  const [filter, setFilter ] = useState({ color: '', shape: '' });

  useEffect(()=> {
    if(props.match.params.filter){
      setFilter(JSON.parse(props.match.params.filter));
    }
    else {
      setFilter({ color: '', shape: '' }); 
    }
  }, [ props.match.params.filter]);

  const navigate = (ev)=> {
    const _filter = {...filter};
    _filter[ev.target.name] = ev.target.value;
    props.history.push(`${JSON.stringify(_filter)}`);
  };

  useEffect(async()=> {
    const response = await fetch('/api/products');
    const products = await response.json();
    setProducts(products);

  }, []);

  const shapeMap = products.filter( product => filter.color === '' || filter.color === product.color ).reduce((acc, product)=> {
    acc[product.shape] = acc[product.shape] || 0;
    acc[product.shape]++
    return acc;
  }, {});

  const colorMap = products.filter(product => filter.shape === '' || filter.shape === product.shape ).reduce((acc, product)=> {
    acc[product.color] = acc[product.color] || 0;
    acc[product.color]++
    return acc;
  }, {});

  console.log(colorMap);


  return (
    <div>
      <section>
        <a href='#'>All</a>
        <h2>Filters</h2>
        <Facet map={ colorMap } name='color' navigate={ navigate } filter={ filter }/>
        <Facet map={ shapeMap } name='shape' navigate={ navigate } filter={ filter }/>
      </section>
      <section>
        <h2>Products</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Color</th>
              <th>Shape</th>
            </tr>
          </thead>
          <tbody>
            {
              products
                .filter(product => filter.color === '' || filter.color === product.color )
                .filter(product => filter.shape === '' || filter.shape === product.shape )
                .map( product => {
                return (
                  <tr key={ product.id }>
                    <td>
                      { product.name }
                    </td>
                    <td>
                      { product.color }
                    </td>
                    <td>
                      { product.shape }
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </section>
    </div>
  );
};

const Routes = ()=> {
  return (
    <HashRouter>
      <Route component= { App } path='/:filter?' />
    </HashRouter>
  );
};

render(<Routes />, document.querySelector('#root'));
