import React, { Fragment, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import axiosClient from '../../config/axios';
import { CrmContext } from '../../context/CrmContext';


function Product({product, products, setProducts}) {
    const [auth, setAuth] = useContext(CrmContext);

    const navigate = useNavigate();

    const deleteProduct = (productId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this action",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete product'
        })
        .then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosClient.delete(`/products/${productId}`, {
                        headers: {
                            'x-token': auth.token
                        }
                    });

                    // Show pop up.
                    Swal.fire(
                        'Success',
                        `Product ${response.data.product.name} has been deleted.`,
                        'success'
                    );

                    // Filtering out the element from the frontend array and updating the state of Products.
                    const filteredProducts = products.filter(element => element.uid !== productId);

                    setProducts(filteredProducts);
                } catch (error) {
                    if (error.response.status === 401) {
                        Swal.fire(
                            'Error',
                            'Invalid or expired session.',
                            'error'
                        );

                        setAuth({
                            ...auth,
                            auth: false
                        });

                        navigate('/login', {replace: true});

                        return;
                    }

                    if (error.response.status === 403) {
                        Swal.fire(
                            'Error',
                            'No authorization.',
                            'error'
                        );

                        return;
                    }

                    if (error.response.data.msg) {
                        Swal.fire(
                            'Error',
                            error.response.data.msg,
                            'error'
                        );
                    } else {
                        Swal.fire(
                            'Error',
                            `Unexpected error encountered. Check with the system administrator.`,
                            'error'
                        );
                    }
                }
            }
        });
    }


    return (
        <Fragment>
            <li className="producto">
                <div className="info-producto">
                    <p className="nombre">{product.name}</p>
                    <p className="precio">${product.price} </p>
                    { // If there is an image, we render the img tag. Else, we don't.
                        product.image ? (<img src={product.image} width={350} alt={`${product.name} Image`}/>) : null
                    }
                </div>
                <div className="acciones">
                    <Link to={`/products/edit/${product.uid}`} className="btn btn-azul">
                        <i className="fas fa-pen-alt"></i>
                        Edit Product
                    </Link>

                    <button
                        type="button"
                        className="btn btn-rojo btn-eliminar"
                        onClick={() => deleteProduct(product.uid)}
                    >
                        <i className="fas fa-times"></i>
                        Delete Product
                    </button>
                </div>
            </li>
        </Fragment>
    )
}

export default Product;