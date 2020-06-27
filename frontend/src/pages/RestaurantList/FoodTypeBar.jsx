import React, { useState, useEffect } from "react";
import axios from "axios";
import { requestHandler } from "../../common/utils";

const FoodTypeBar = (props) => {
  function changeFoodType(e) {
    props.setType(e.target.id);
  }

  const [foodTypes, setFoodTypes] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const uri = `/categories/`;
      const action = async () => axios.get(uri);
      const result = await requestHandler(action);
      setFoodTypes(result);
    };
    fetch();
  }, []);

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <h1>Test</h1>
        </div>
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item active" aria-current="page">
                  <a onClick={changeFoodType} id={""} className="food-type"
>
                    All
                  </a>
                </li>
                {foodTypes.map((foodType) => (
                  <li class="breadcrumb-item active" aria-current="page">
                    <a
                      onClick={changeFoodType}
                      id={foodType._id}
                      className="food-type"
                    >
                      {foodType.name}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <form class="form-inline my-2 my-lg-0">
              <input
                class="form-control col-6 mr-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                class="btn btn-outline-success my-2 my-sm-0"
                type="submit"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FoodTypeBar;
