import React, { Fragment, useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

import axiosClient from '../../config/axios';
import { CrmContext } from '../../context/CrmContext';


function EditUser() {
    // Retrieve the User ID from the url/params (This is sent automatically by react-router-dom)
    const { userId } = useParams();

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

    // Query API - Get user to be edited.
    const getUser = async () => {
        const userApi = await axiosClient.get(`/search/users/${userId}`);

        if (userApi.data.results.length === 1) {
            // setUser(userApi.data.results[0]);

            setUser({
                name: userApi.data.results[0].name || '',
                email: userApi.data.results[0].email || '',
                image: userApi.data.results[0].image || '',
                role: userApi.data.results[0].role || ''
            });
        }
    }


    // useEffect to syncronize with the external system (our rest api).
    useEffect(() => {
        if (auth.auth) {
            getUser();
        } else {
            navigate('/login', {replace: true});
        }
    }, []);


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
            const response = await axiosClient.put(`/users/${userId}`, user, {
                headers: {
                    'x-token': auth.token
                }
            });

            // console.log(response);

            Swal.fire(
                'Success',
                `User ${response.data.user.name} has been updated.`,
                'success'
            );

            // Redirect to home after a user is updated.
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
        const {name, email, role} = user;

        // Validate object's properties
        // if .length = 0. We do !0 to convert it to true.
        const isDisabled = !name.length || !email.length || !role.length;

        return isDisabled; // isDisabled will only be false when all mandatory properties have a value.
    }


    return (
        <Fragment>
            <h2>Edit User</h2>

            <form
                onSubmit={handleSubmit}
            >
                <legend>Edit User Form</legend>

                <div className="campo">
                    <label>Full Name:</label>
                    <input
                        type="text"
                        placeholder="User Full Name"
                        name="name"
                        onChange={handleChange}
                        value={user.name}
                    />
                </div>

                <div className="campo">
                    <label>Role:</label>
                    <input
                        type="text"
                        placeholder="USER_ROLE"
                        name="role"
                        onChange={handleChange}
                        value={user.role}
                    />
                </div>
            
                <div className="campo">
                    <label>Profile Picture:</label>
                    <input
                        type="text"
                        placeholder="User Profile Picture URL"
                        name="image"
                        onChange={handleChange}
                        value={user.image}
                    />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="User Email"
                        name="email"
                        onChange={handleChange}
                        value={user.email}
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
                        value="Save Changes"
                        disabled={ validateForm() }
                    />
                </div>
            </form>
        </Fragment>
    )
}


export default EditUser;