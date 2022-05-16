import React from "react";
import repository from "../repository";
import Toolbar from "./Toolbar";
import css from "./home.module.css";
import Card from "./Card";
import router from "./router";
import { SHAPES } from "./Map";
import { Button } from "react-bootstrap";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: repository.getList({ level: 0 }),
            mindMapsAuth :JSON.parse(window.sessionStorage.getItem('mindMapsAuth'))
        }
    }

    add() {
        repository.save({
            name: 'Bright Idea!',
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
            <>
                <h1>Home</h1>
                <Toolbar list={this.actionMenu} type="alert" location={['vertical', 'right', 'bottom']} />
                {this.state.mindMapsAuth && <div className={css.list}>
                    {
                        this.state.list.map(item => (
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
                </div>}
                {!this.state.mindMapsAuth && <div>
                    <h4>You need to login to see this page</h4>
                    <Button onClick={()=>router.setRoute('login')}>Please Login </Button></div>}
            </>
        );
    }
}

export default Home;
