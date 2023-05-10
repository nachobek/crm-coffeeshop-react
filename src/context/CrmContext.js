import React, { useState } from 'react';

const CrmContext = React.createContext([{}, () => {}]);

const CrmProvider = props => {
    const [auth, setAuth] = useState({
        token: '',
        auth: false
    });

    return (
        <CrmContext.Provider value={[auth, setAuth]}>
            {props.children}
        </CrmContext.Provider>
    )
}

export { CrmContext, CrmProvider }