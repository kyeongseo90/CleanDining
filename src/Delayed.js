import React, {useState, useEffect} from 'react';

const Delayed = () => {
    const [showComponent, setShowComponent] = useState(false);

    useEffect(()=>{
        setInterval(()=>{
            setShowComponent(!showComponent);
        }, 3000);
    }, []);


}

export default Delayed;