import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ExtraItem from './ExtraItem';

const ExtrasTab = ({ restaurantId, extras }) => {

    const createUri = `/owner/restaurants/${restaurantId}/create/extra`;
    if (!extras?.length) return <>
        <h3 className="mb-3">No extras yet</h3>

        <Link to={createUri} className="d-flex align-items-center text-decoration-none mb-3">
            <div>
                <FontAwesomeIcon icon={faPlus} size={'2x'}
                    style={{ color: 'green', height: "20px" }} />
            </div>
            <div className="text-decoration-none text-dark">
                Create Extra
            </div>
        </Link>
    </>

    return <>

        <p className="text-muted">Extras are additional products offered,&nbsp;
            which are sold next to the pizza</p>
        <Link to={createUri} className="d-flex align-items-center text-decoration-none mb-3">
            <div>
                <FontAwesomeIcon icon={faPlus} size={'2x'}
                    style={{ color: 'green', height: "20px" }} />
            </div>
            <div className="text-decoration-none text-dark">
                Create Extra
            </div>
        </Link>

        {
            extras.map((extra, i) =>
                <div className="p-3 mb-3 border border-darken-1" key={`p-${i}`}>
                    <ExtraItem extra={extra} />
                </div>
            )
        }
    </>
};

export default ExtrasTab;