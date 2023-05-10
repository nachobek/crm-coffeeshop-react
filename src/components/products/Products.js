import React, { useEffect, useState, Fragment, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import axiosClient from '../../config/axios';
import Product from './Product';
import Spinner from '../layout/Spinner';
import { CrmContext } from '../../context/CrmContext';


function Products() {
    const [products, setProducts] = useState([]);

    const [auth, setAuth] = useContext(CrmContext);

    const navigate = useNavigate();

    const queryAPI = async () => {
        const productsResult = await axiosClient.get('/products', {
            params: {
                offset: 0,
                limit: 200
            }
        });

        setProducts(productsResult.data.products);
    }

    // useEffect to query the API when page loads.
    useEffect(() => {
        if (auth.auth) {
            queryAPI();
        } else {
            navigate('/login', {replace: true});
        }
    }, [] );

    // Spinner
    if (!products.length) {
        return <Spinner />
    }

    return (
        <Fragment>
            <h2>Products</h2>

            <Link to={"/products/new"} className="btn btn-verde nvo-cliente">
                <i className="fas fa-plus-circle"></i>
                New Product
            </Link>

            <ul className="listado-productos">
                {
                    products.map(product => (
                        <Product
                            key={product.uid}
                            product={product}
                            products={products}
                            setProducts={setProducts}
                        />
                    ))
                }
            </ul>
        </Fragment>
    )
}

export default Products;