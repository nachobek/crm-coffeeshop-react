import React, { Fragment, useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import axiosClient from '../../config/axios';
import { CrmContext } from '../../context/CrmContext';


function EditProduct() {
    // Retrieve the Product ID from the url/params (This is sent automatically by react-router-dom)
    const { productId } = useParams();

    const [product, setProduct] = useState({
        name: '',
        user: '', // TODO: Gather the userId from the session Token and update it when changing the state.
        price: '',
        category: '',
        description: '',
        isAvailable: ''
    });

    const [imageFile, setImageFile] = useState('');

    const [submitDisabled, setSubmitDisabled] = useState(false);

    const navigate = useNavigate();

    const [auth, setAuth] = useContext(CrmContext);

    const getProduct = async () => {
        const productResponse = await axiosClient.get(`products/${productId}`);

        setProduct({
            name: productResponse.data.product.name,
            // user: productResponse.data.product.user._id,
            price: productResponse.data.product.price,
            category: productResponse.data.product.category._id,
            description: productResponse.data.product.description,
            isAvailable: productResponse.data.product.isAvailable,
            image: productResponse.data.product.image
        });
    }

    // useEffect to syncronize with the external system (our rest api).
    useEffect(() => {
        if (auth.auth) {
            getProduct();
        } else {
            navigate('/login', {replace: true});
        }
    }, []);


    const handleProductInfoChange = e => {
        setProduct({
            // Get a copy of current state to retain any previous data in the object.
            ...product,
            // Update it with new form data.
            [e.target.name] : e.target.value
        });
    }


    const handleProductIsAvailableChange = e => {
        setProduct({
            ...product,
            isAvailable: e.target.checked
        });
    }


    const handleProductImageChange = e => {
        setImageFile(e.target.files[0]);
    }


    const handleSubmit = async e => {
        e.preventDefault();

        if (!auth.auth) {
            navigate('/login', {replace: true});
            return;
        }

        setSubmitDisabled(true);

        try {
            const response = await axiosClient.put(`products/${productId}`, {
                name: product.name,
                price: product.price,
                category: product.category,
                description: product.description,
                isAvailable: product.isAvailable.toString()
            }, {
                headers: {
                    'x-token': auth.token
                }
            });

            if (imageFile) {
                await axiosClient.put(`uploads/products/${productId}`, {
                    'file': imageFile
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            Swal.fire(
                'Success',
                `Product ${response.data.product.name} has been updated.`,
                'success'
            );

            navigate('/products', {replace: true});
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

            if (error.response.data.errors) {
                let errorMessages = '';

                error.response.data.errors.forEach(error => {
                    errorMessages = errorMessages + `<p>${error.msg}</p>`
                });

                Swal.fire(
                    'Error',
                    errorMessages,
                    'error'
                );
            } else if(error.response.data.msg) {
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

            setSubmitDisabled(false);
        }
    }

    // if (!auth.auth) {
    //     navigate('/login', {replace: true});
    //     return;
    // }
    
    return (
        <Fragment>
            <h2>Edit Product</h2>

            <form onSubmit={handleSubmit}>
                    <legend>Edit Product Form</legend>

                    <div className="campo">
                        <label>Name:</label>
                        <input type="text" placeholder="Product Name" name="name" onChange={handleProductInfoChange} value={product.name} />
                    </div>

                    <div className="campo">
                        <label>Price:</label>
                        <input type="number" name="price" min="0" step="1" placeholder="Price" onChange={handleProductInfoChange} value={product.price} />
                    </div>

                    <div className="campo">
                        <label>Category ID:</label>
                        <input type="text" name="category" placeholder="Category ID" onChange={handleProductInfoChange} value={product.category} />
                    </div>

                    <div className="campo">
                        <label>Description:</label>
                        <input type="text" placeholder="Product Description" name="description" onChange={handleProductInfoChange} value={product.description} />
                    </div>

                    <div className="campo">
                        <label>In Stock?:</label>
                        <input className='checkbox' type="checkbox" name="isAvailable" onChange={handleProductIsAvailableChange} checked={product.isAvailable} />
                    </div>

                    <div className="campo">
                        <label>Image:</label>
                        { 
                            product.image ? (<img src={product.image} width={150} alt={`${product.name} Image`}/>) : null
                        }
                        <input type="file"  name="image" onChange={handleProductImageChange} />
                    </div>

                    <div className="enviar">
                            <input type="submit" className="btn btn-azul" value="Edit Product" disabled={submitDisabled} />
                    </div>
                </form>
        </Fragment>
    )
}

export default EditProduct;