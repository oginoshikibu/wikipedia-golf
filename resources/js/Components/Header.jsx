import React from 'react';


export default function Header({auth, children}) {
    return (
        <div>
            <h1>Header</h1>
            {children}
        </div>
    );
}
