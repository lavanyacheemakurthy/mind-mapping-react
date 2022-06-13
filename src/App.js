import React from "react";
import Breadcrumbs from "./ui-components/Breadcrumbs";
import Content from "./ui-components/Content";
import Header from "./ui-components/Header";
import LeftMenu from "./ui-components/LeftMenu";
import router from "./ui-components/router";
import routes from "./ui-components/routes";
import 'bootstrap/dist/css/bootstrap.min.css';
import { } from "./App.css";
export const FIREBASE_URL = 'https://mindmaps-50297-default-rtdb.asia-southeast1.firebasedatabase.app'
class App extends React.Component {
  constructor(props) {
    super(props);
    router.init(routes);
    const route = router.getRoute();
    this.state = {
      component: route.component,
      breadcrumbs: route.breadcrumbs,
      isMenuVisible: false
    };
    router.subscribe(this.onRouteChange);
    this.initialize = this.initialize.bind(this);
    this.initialize();
  }
  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
  }
  initialize() {
    fetch(FIREBASE_URL + '/data.json', {
      method: 'GET'
    }).then(res => res.json()).then(res => {
      let keys = res ? Object.keys(res) : null;
      if (keys && keys.length > 0) {
        keys.sort((a, b) => res[a].insertDate > res[b].insertDate ? 1 : -1)
        let latestData = res[keys.slice(-1)];
        console.log("latest data", latestData);
        if (latestData && latestData.mapsData && latestData.mapsData.length > 0) {
          window.localStorage.setItem("data", JSON.stringify(latestData.mapsData))
        }
      } else {
        window.localStorage.removeItem("data")
      }

    })
  }
  componentWillUnmount() {
    window.sessionStorage.removeItem('mindMapsAuth')
  }
  onRouteChange = () => {
    const route = router.getRoute();
    if (this._isMounted) {
      this.setState({
        component: route.component,
        breadcrumbs: route.breadcrumbs
      });
    }
  };
  toggleMenu = () => {
    const isMenuVisible = !this.state.isMenuVisible;
    this.setState({ isMenuVisible });
  };
  hideMenu = () => {
    this.setState({ isMenuVisible: false });
  };

  render() {
    return (<div>
      {/* <Header onMenuClick={this.toggleMenu} /> */}
      {/* <LeftMenu isMenuVisible={this.state.isMenuVisible} onMouseLeave={this.hideMenu} /> */}
      {/* <Breadcrumbs list={this.state.breadcrumbs} /> */}
      <Content component={this.state.component} />
    </div>);
  }
}

export default App;
