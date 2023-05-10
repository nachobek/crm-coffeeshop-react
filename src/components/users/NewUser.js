import React, { Fragment, useState, useContext, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

import axiosClient from '../../config/axios';
import { CrmContext } from '../../context/CrmContext';


function NewUser() {
    // user = state, setUser = function to save the state.
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        image: '',
        role: ''
    });

    const [auth, setAuth] = useContext(CrmContext);

    // Enable redirection with useNavigate.
    const navigate = useNavigate();

    // Read form data 
    const handleChange = e => {
        // Store user's input in the state.
        setUser({
            // Get a copy of current state to retain any previous data in the object.
            ...user,
            // Update it with new form data.
            [e.target.name] : e.target.value
        });
    }

    // Post data to our rest API.
    const handleSubmit = async e => {
        e.preventDefault();

        if (!auth.auth) {
            navigate('/login', {replace: true});
            return;
        }

        try {
            const response = await axiosClient.post('/users', user, {
                headers: {
                    'x-token': auth.token
                }
            });

            // console.log(response);

            Swal.fire(
                'Success',
                `User ${response.data.user.name} has been created.`,
                'success'
            );

            // Clear the state. This will deactivate the submit button but retain visible the values used in the form.
            // setUser({
            //     name: '',
            //     email: '',
            //     password: '',
            //     image: '',
            //     role: ''
            // });

            // Redirect to home after a user is created.
            navigate('/', {replace: true});
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

                navigate('/', {replace: true});

                return;
            }

            if (error.response.data.errors) {
                // console.log(`HTTP response ${error.response.status} when creating user:\n`, error.response.data.errors);

                let errorMessages = '';

                error.response.data.errors.forEach(error => {
                    errorMessages = errorMessages + `<p>${error.msg}</p>`
                });

                Swal.fire(
                    'Error',
                    errorMessages,
                    'error'
                );
            } else {
                // console.log('Error when creating user:\n', error);

                Swal.fire(
                    'Error',
                    `Unexpected error encountered. Check with the system administrator.`,
                    'error'
                );
            }
        }
    }

    // Validate form and enable submit button if valid.
    const validateForm = () => {
        // Destructure state
        const {name, email, password, role} = user;

        // Validate object's properties
        // if .length = 0. We do !0 to convert it to true.
        const isDisabled = !name.length || !email.length || !password.length || !role.length

        return isDisabled; // isDisabled will only be false when all mandatory properties have a value.
    }

    useEffect(() => {
        if (!auth.auth) {
            navigate('/login', {replace: true});
        }
    }, [] );

    return (
        <Fragment>
            <h2>New User</h2>

            <form
                onSubmit={handleSubmit}
            >
                <legend>New User Form</legend>

                <div className="campo">
                    <label>Full Name:</label>
                    <input
                        type="text"
                        placeholder="User Full Name"
                        name="name"
                        onChange={handleChange}
                    />
                </div>

                <div className="campo">
                    <label>Role:</label>
                    <input
                        type="text"
                        placeholder="USER_ROLE"
                        name="role"
                        onChange={handleChange}
                    />
                </div>
            
                <div className="campo">
                    <label>Profile Picture:</label>
                    <input
                        type="text"
                        placeholder="User Profile Picture URL"
                        name="image"
                        onChange={handleChange}
                    />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="User Email"
                        name="email"
                        onChange={handleChange}
                    />
                </div>

                <div className="campo">
                    <label>Password:</label>
                    <input
                        type="password"
                        placeholder="Initial Temporary Password"
                        name="password"
                        onChange={handleChange}
                    />
                </div>

                <div className="enviar">
                    <input
                        type="submit"
                        className="btn btn-azul"
                        value="Create User"
                        disabled={ validateForm() }
                    />
                </div>
            </form>
        </Fragment>
    )
}


export default NewUser;