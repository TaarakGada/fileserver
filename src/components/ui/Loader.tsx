import React from 'react';
import { helix } from 'ldrs';

function Loader() {
    helix.register();
    return (
        <l-helix
            size="60"
            speed="4.5"
            color="white"
        ></l-helix>
    );
}

export default Loader;
