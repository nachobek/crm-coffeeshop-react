import React, { useEffect, useState, Fragment, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import axiosClient from '../../config/axios';
import User from './User'
import Spinner from '../layout/Spinner';
import { CrmContext } from '../../context/CrmContext';


function Users() {

    // By convention, we call useState() at the top of the component and do array destructuring to create the state variables, like so:
    // users = state, setUsers = function to save the state.
    const [users, setUsers] = useState([]);

    const [auth, setAuth] = useContext(CrmContext);

    const navigate = useNavigate();

    const queryAPI = async () => {
        const usersResult = await axiosClient.get('/users', {
            params: {
                offset: 0,
                limit: 100
            }
        });

        setUsers(usersResult.data.users);
    }

    // useEffect to syncronize with the external system (our rest api).
    useEffect( () => {
        if (auth.auth) {
            queryAPI();
        } else {
            navigate('/login', {replace: true});
        }
    }, [] ); // Passing an empty array as dependency to prevent useEffect() from getting hung and run multiple times.
    // }, [users] ); // Passing users as a dependency so the users are refreshed if there is a change in the state.-- Awful idea because the backend server/api is called constantly.


    // Spinner
    if (!users.length) {
        return <Spinner />
    }

    return (
        <Fragment>
            <h2>Users</h2>

            <Link to={"/users/new"} className="btn btn-verde nvo-cliente">
                <i className="fas fa-plus-circle"></i>
                New User
            </Link>

            <ul className='listado-clientes'>
                {/* Code between curly braces acts as regular javascript */}
                {users.map(user => (
                    // For each user, we call the User component, which will render all its attributes.
                    // And pass each user as "props" to the User.js component.
                    <User 
                        key={user.uid} // key is required by react.
                        user={user} // user is the name given when passing to the component.
                        users={users}
                        setUsers={setUsers}
                    />
                ))}
            </ul>
        </Fragment>
    )
}

export default Users;