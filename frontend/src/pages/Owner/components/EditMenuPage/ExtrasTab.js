import React from 'react';
import { Link } from 'react-router-dom';
import ExtraItem from './ExtraItem';

const ExtrasTab = ({ restaurantId, extras }) => {
    
    const createUri = `/owner/restaurants/${restaurantId}/create/extra`;
    if (!extras?.length) return <>
        <h3>No extras yet</h3>

        <Link to={createUri} className="btn btn-success">
            Create Extra
        </Link>
    </>
    
    return <>
        {
            extras.map((extra, i) =>
                <div className="p-3 mb-3" style={{ border: '1px solid blue' }} key={`p-${i}`}>
                    <ExtraItem extra={extra} />
                </div>
            )
        }

        <Link to={createUri} className="btn btn-success">
            Create Extra
        </Link>
    </>
};

export default ExtrasTab;