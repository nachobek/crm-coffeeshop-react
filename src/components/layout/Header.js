import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { CrmContext } from '../../context/CrmContext';

const Header = () => {
    const [auth, setAuth] = useContext(CrmContext);

    const navigate = useNavigate();

    const handleSignOut = () => {
        // localStorage.setItem('token', '');

        setAuth({
            token: '',
            auth: false
        });

        navigate('/login', {replace: true});
    }

    return (
        <header className="barra">
            <div className="contenedor">
                <div className='contenido-barra'>
                    <Link to={"/"}>
                        <h1>CRM - Coffee Shop</h1>
                    </Link>
                    { auth.auth ? (
                        <button type='button' className='btn btn-rojo' onClick={handleSignOut}>
                            <i className='far fa-times-circle'></i>
                            Sign Out
                        </button>

                    ) : null }
                </div>
            </div>
        </header>
    )
}

export default Header;