import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Link } from 'react-router-dom';

//TODO - Filter passed a map and an onChange.

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

  useEffect(()=> {
    setProducts([
      { id: 1, name: 'Foo', shape: 'circle', color: 'red' }, 
      { id: 2, name: 'Bar', shape: 'square', color: 'blue' },
      { id: 3, name: 'Bazz', shape: 'circle', color: 'blue' },
      { id: 4, name: 'Qug', shape: 'circle', color: 'red' },
      { id: 5, name: 'Scrib', shape: 'diamond', color: 'red' },
    ])
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


  return (
    <div>
      <section>
        <a href='#'>All</a>
        <h2>Filters</h2>
        <div>
          <h3>Color</h3>
          <label>All <input checked={ filter.color === '' } onChange={ navigate } type='checkbox' name='color' value=''/></label>
          <label>Blue ({ colorMap.blue || 0 })<input checked={ filter.color === 'blue' } onChange={ navigate } type='checkbox' name='color' value='blue' disabled={ !colorMap.blue } /></label>
          <label>Red ({ colorMap.red || 0 })<input checked={ filter.color === 'red' } onChange={ navigate } type='checkbox' name='color' value='red' disabled={ !colorMap.red }/></label>
        </div>
        <div>
          <h3>Shape</h3>
          <label>All <input checked={ filter.shape === '' } onChange={ navigate } type='checkbox' name='shape' value=''/></label>
          <label>Square ({ shapeMap.square || 0 })<input checked={ filter.shape === 'square' } onChange={ navigate } type='checkbox' name='shape' value='square' disabled={ !shapeMap.square }/></label>
          <label>Circle ({ shapeMap.circle || 0 })<input checked={ filter.shape === 'circle' } onChange={ navigate } type='checkbox' name='shape' value='circle' disabled={ !shapeMap.circle }/></label>
          <label>Diamond ({ shapeMap.diamond || 0 })<input checked={ filter.shape === 'diamond' } onChange={ navigate } type='checkbox' name='shape' value='diamond' disabled={ !shapeMap.diamond }/></label>
        </div>
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
