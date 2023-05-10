import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import axiosClient from '../../config/axios';
import { CrmContext } from '../../context/CrmContext';


// We can receive props and then use what's needed in the function. Or destructure the element that we need and use it directly.

// function Client(props) {
function User({user, users, setUsers}) {
    // const user = props.user;

    const [auth, setAuth] = useContext(CrmContext);

    const navigate = useNavigate();

    // Delete user function.
    const deleteUser = (userId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this action",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete user'
        })
        .then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosClient.delete(`users/${userId}`, {
                        headers: {
                            'x-token':  auth.token
                        }
                    });

                    Swal.fire(
                        'Success',
                        `User ${response.data.user.name} has been deleted.`,
                        'success'
                    );

                    // Filtering out the element from the frontend array and updating its state so the list of users is refreshed without calling the server again.
                    const filteredUsers = users.filter(element => element.uid !== userId);

                    setUsers(filteredUsers);
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
                    } else {
                        if (error.response.status === 401) {
                            Swal.fire(
                                'Error',
                                `No authorization`,
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
            }
        });
    }

    return (
        <li className="cliente">
            <div className="info-cliente">
                <p className="nombre">{user.name}</p>
                {/* <p className="empresa">{user.role}</p> */}
                <p>{user.role}</p>
                <p>{user.email}</p>
                <p>Google Account: {user.googleLinked ? 'True' : 'False'}</p>
            </div>
            <div className="acciones">
                <Link to={`/users/edit/${user.uid}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Edit User
                </Link>
                <button
                    type="button"
                    className="btn btn-rojo btn-eliminar"
                    // onClick={deleteUser(user.uid)} // This way, the function deleteUser will be executed instantly, because of the brackets -> deleteUser().
                    onClick={() => deleteUser(user.uid)} // To workaround this, we must use an arrow function, like so.
                >
                    <i className="fas fa-times"></i>
                    Delete User
                </button>
            </div>
        </li>
    )
}


export default User;