import React, { Fragment, useContext } from 'react';


// Routing
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


// Layout
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';


// Components
import Users from './components/users/Users';
import NewUser from './components/users/NewUser';
import EditUser from './components/users/EditUser';

import Products from './components/products/Products';
import NewProduct from './components/products/NewProduct';
import EditProduct from './components/products/EditProduct';

import Orders from './components/orders/Orders';

import Login from './components/auth/Login';

import { CrmContext, CrmProvider } from './context/CrmContext';


// App
function App() {
  // Use/set up the context so they are available in all components.
  const [auth, setAuth] = useContext(CrmContext);

  return (
    // I can only return 1 component/element in each function in JSX.
    // If I need to return more than 1, I can import and use the Fragment component, like so.
    <Router>
      <Fragment>
        <CrmProvider value={ [auth, setAuth] }>
          <Header />

          <div className='grid contenedor contenido-principal'>
            <Navbar />

            <main className='caja-contenido col-9'>
              <Routes>
                <Route exact path='/' element={<Users/>} />
                <Route exact path='/users/new' element={<NewUser/>} />
                <Route exact path='/users/edit/:userId' element={<EditUser/>} />

                <Route exact path='/products' element={<Products/>} />
                <Route exact path='/products/new' element={<NewProduct/>} />
                <Route exact path='/products/edit/:productId' element={<EditProduct/>} />

                <Route exact path='/orders' element={<Orders/>} />

                <Route exact path='/login' element={<Login/>} />
              </Routes>
            </main>

          </div>
        </CrmProvider>
      </Fragment>
    </Router>
  )
}


export default App;
