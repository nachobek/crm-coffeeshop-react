import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import axiosClient from '../../config/axios';
import { CrmContext } from '../../context/CrmContext';


function Login() {
    const [credentials, setCredentials] = useState({});

    const navigate = useNavigate();

    const [auth, setAuth] = useContext(CrmContext);

    const handleChange = e => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const response = await axiosClient.post('auth/login', credentials);

            if (response.data.token) {
                // localStorage.setItem('token', response.data.token);

                setAuth({
                    token: response.data.token,
                    auth: true
                });
            }

            Swal.fire(
                'Success',
                `Logged in successfully.`,
                'success'
            );

            navigate('/', {replace: true});
        } catch (error) {
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
        }

    }


    return(
        <div className='login'>
            <h2>Sign in</h2>

            <div className="contenedor-formulario">
                <form onSubmit={handleSubmit}>
                    <div className="campo" style={{padding: "0.5rem 0rem"}}>
                        <input type="text" name="email" placeholder="Email address" required onChange={handleChange} />
                    </div>

                    <div className="campo" style={{padding: "0.5rem 0rem"}}>
                        <input type="password" name="password" placeholder='Password' required onChange={handleChange} />
                    </div>

                    <input type="submit" value="Sign in" className="btn btn-verde btn-block" />
                </form>
            </div>
        </div>
    )    
}


export default Login;