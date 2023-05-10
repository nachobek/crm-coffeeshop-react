import React, { Fragment, useState, useContext, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

import axiosClient from '../../config/axios';
import { CrmContext } from '../../context/CrmContext';


function NewProduct() {
    const [product, setProduct] = useState({});

    const [imageFile, setImageFile] = useState('');

    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [auth, setAuth] = useContext(CrmContext);

    // Enable redirection with useNavigate.
    const navigate = useNavigate();

    const readProductInfoForm = e => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    }

    const readProductImageFile = e => {
        // console.log(e.target.files);
        setImageFile(e.target.files[0]);
    }

    // Create the new product in the DB.
    const handleSubmit = async e => {
        e.preventDefault();

        if (!auth.auth) {
            navigate('/login', {replace: true});
            return;
        }

        setSubmitDisabled(true);

        try {
            const response = await axiosClient.post('products', product, {
                headers: {
                    'x-token': auth.token
                }
            });

            if (response.data.product.uid && imageFile) {
                await axiosClient.put(`uploads/products/${response.data.product.uid}`, {
                    'file': imageFile
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            Swal.fire(
                'Success',
                `Product ${response.data.product.name} has been created.`,
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

            if (error.response.status === 403) {
                Swal.fire(
                    'Error',
                    'No authorization.',
                    'error'
                );

                navigate('/products', {replace: true});

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

    useEffect(() => {
        if (!auth.auth) {
            navigate('/login', {replace: true});
        }
    }, [] );

    return (
        <Fragment>
            <h2>New Product</h2>

            <form onSubmit={handleSubmit}>
                    <legend>New Product Form</legend>

                    <div className="campo">
                        <label>Name:</label>
                        <input type="text" placeholder="Product Name" name="name" onChange={readProductInfoForm} />
                    </div>

                    <div className="campo">
                        <label>Price:</label>
                        <input type="number" name="price" min="0" step="1" placeholder="Price" onChange={readProductInfoForm} />
                    </div>

                    <div className="campo">
                        <label>Category ID:</label>
                        <input type="text" name="category" placeholder="Category ID" onChange={readProductInfoForm} />
                    </div>
                
                    <div className="campo">
                        <label>Image:</label>
                        <input type="file"  name="image" onChange={readProductImageFile} />
                    </div>

                    <div className="enviar">
                            <input type="submit" className="btn btn-azul" value="Add Product" disabled={submitDisabled}/>
                    </div>
                </form>
        </Fragment>
    )
}

export default NewProduct;