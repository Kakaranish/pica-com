import React, { useEffect, useState } from 'react';
import TabHeader from './components/TabHeader';
import TabContent from './components/TabContent';
import PizzasTab from './components/EditMenuPage/PizzasTab';
import axios from 'axios';
import { requestHandler } from '../../common/utils';
import ExtraIngredientsTab from './components/EditMenuPage/ExtraIngredientsTab';
import ExtrasTab from './components/EditMenuPage/ExtrasTab';

const EditMenuPage = ({ match }) => {

    const restaurantId = match.params.id;

    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const fetch = async () => {
            const uri = `/owner/restaurants/${restaurantId}/menu`;
            const action = async () => axios.get(uri, { validateStatus: false });
            const result = await requestHandler(action);

            setState({ loading: false, menu: result });
        };
        fetch();
    }, []);

    if (state.loading) return <></>

    return <>
        <div className="nav nav-tabs" id="nav-tab" role="tablist">

            <TabHeader title={'Pizzas'} uniqueInitial={'nav-pizza'}
                isSelected={true} />

            <TabHeader title={'Extra Ingredients'} uniqueInitial={'nav-extra-ing'} />

            <TabHeader title={'Extras'} uniqueInitial={'nav-extras'} />

            <TabHeader title={'Other Info'} uniqueInitial={'nav-other'} />

        </div>

        <div className="tab-content">

            <TabContent uniqueInitial={'nav-pizza'} isActive={true}>
                <PizzasTab pizzas={state.menu.pizzas} restaurantId={restaurantId} />
            </TabContent>

            <TabContent uniqueInitial={'nav-extra-ing'}>
                <ExtraIngredientsTab extraIngredients={state.menu.extraIngredients}
                    restaurantId={restaurantId} />
            </TabContent>

            <TabContent uniqueInitial={'nav-extras'}>
                <ExtrasTab extras={state.menu.extras} restaurantId={restaurantId} />
            </TabContent>

        </div>
    </>
};

export default EditMenuPage;