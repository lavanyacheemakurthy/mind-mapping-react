import Help from "./Help";
import Home from "./Home";
import Map from "./Map";
import {Login} from './Login'

const routes = {
    'login':{component:<Login/>,breadcrumbs:['login']},
    'home': {component: <Home />, breadcrumbs: ['home']},
    'map': {component: <Map />, breadcrumbs: ['home', 'map']},
    'help': {component: <Help />, breadcrumbs: ['home', 'help']}
};

export default routes;
