import React from "react";
import repository from "../repository";
import Toolbar from "./Toolbar";
import css from "./home.module.css";
import Card from "./Card";
import router from "./router";
import { SHAPES } from "./Map";
import { Button } from "react-bootstrap";
import { FIREBASE_URL } from "../App";

import logo from '../utilities/images/logo.jpg'
export const handleSavemaps = () => {
    let toSaveData = JSON.parse(window.localStorage.getItem('data'));
    fetch(FIREBASE_URL + '/data.json', {
        method: 'POST',
        body: JSON.stringify({ insertDate: new Date(), mapsData: toSaveData })
    }).then(res => res.json()).then(res => {
        console.log("Save success response : ", res);
    }).catch(e => {
        console.log("Not able to save maps.");
    })
}
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: repository.getList({ level: 0 }),
            mindMapsAuth: JSON.parse(window.sessionStorage.getItem('mindMapsAuth'))
        };

    }

    add() {
        repository.save({
            name: 'Idea!',
            level: 0,
            parentId: null,
            displayShape: SHAPES.BIG_CIRCLE,
        });
        this.setState({ list: repository.getList({ level: 0 }) });
    }

    actionMenu = [
        { name: 'add', onClick: () => this.add() },
        { name: 'delete', onClick: () => this.delete(this.state.id) }

    ];

    setSelected(id) {
        this.setState({ id });
    }

    delete(id) {
        repository.delete(id);
        this.setState({ list: repository.getList({ level: 0 }) });
    }

    getMap(id) {
        router.setRoute('map', id);
    }

    render() {
        return (
            <div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <img src={logo}/>
                    <Button variant='outline-warning'>LOGOUT</Button>
                </div>
                <center><h5>Mindmaps</h5></center>
                <Toolbar list={this.actionMenu} type="alert" location={['vertical', 'right', 'bottom']} />
                {this.state.mindMapsAuth && <div>
                    <div style={{ display: 'flex', justifyContent: 'end' }}><Button onClick={handleSavemaps}>Save maps</Button></div>
                    <div className={css.list}>
                        {
                            // this.state.list.map(item => (
                            repository.getList({ level: 0 }).map(item => (
                                <div className={css.item}
                                    onDoubleClick={() => this.getMap(item.id)}
                                    key={item.id}>
                                    <Card id={item.id}
                                        onClick={() => this.setSelected(item.id)}
                                        isSelected={item.id === this.state.id}
                                        name={item.name} comment={item.comment} />
                                </div>
                            ))
                        }
                    </div></div>}
                {!this.state.mindMapsAuth && <div>
                    <h4>You need to login to see this page</h4>
                    <Button onClick={() => router.setRoute('login')}>Please Login </Button></div>}
            </div>
        );
    }
}

export default Home;
