import React, { useState, useEffect } from "react";
import axios from "axios";
import { requestHandler } from "../../../common/utils";

const CategoryBar = ({ setCategoryId }) => {

  const [localId, setLocalId] = useState(-1);
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    const fetch = async () => {
      const uri = `/categories`;
      const action = async () => axios.get(uri);
      const categories = await requestHandler(action);
      setState({ loading: false, categories });
    };
    fetch();
  }, []);

  function changeFoodType(event) {
    setLocalId(event.target.id);
    setCategoryId(event.target.id != -1
      ? event.target.id
      : null);
  }

  if (state.loading) return <></>

  return <React.Fragment>
    <div className="container">
      <div className="row">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb light-gray">
              <li className="breadcrumb-item active" aria-current="page">
                <a onClick={changeFoodType} id={-1} className="food-type">
                  {
                    localId == -1
                      ? <b>All</b>
                      : <>All</>
                  }
                </a>
              </li>

              {
                state.categories.map((category, i) => (
                  <li className="breadcrumb-item active" aria-current="page"
                    key={`ft-${i}`}>
                    <a onClick={changeFoodType}
                      id={category._id}
                      className="food-type"
                    >
                      {
                        localId == category._id
                          ? <b>{category.name}</b>
                          : <>{category.name}</>
                      }
                    </a>
                  </li>
                ))
              }

            </ol>
          </nav>
        </div>
      </div>
    </div>
  </React.Fragment>
};

export default CategoryBar;
