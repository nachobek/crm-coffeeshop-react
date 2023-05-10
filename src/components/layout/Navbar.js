import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { CrmContext } from '../../context/CrmContext';

const Navbar = () => {
    const [auth, setAuth] = useContext(CrmContext);

    if (!auth.auth) return null;

    return ( 
        <aside className="sidebar col-3">
            <h2>Admin Panel</h2>

            <nav className="navegacion">
                <Link to={"/"} className="clientes">Users</Link>
                <Link to={"/products"} className="productos">Products</Link>
                <Link to={"/orders"} className="pedidos">Orders</Link>
            </nav>
        </aside>
    );
}
 
export default Navbar;