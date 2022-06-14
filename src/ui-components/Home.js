import React from "react";
import repository from "../repository";
import Toolbar from "./Toolbar";
import css from "./home.module.css";
import Card from "./Card";
import router from "./router";
import { SHAPES } from "./Map";
import { Button } from "react-bootstrap";
import { FIREBASE_URL } from "../App";

import logo from "../utilities/images/logo.jpg";
let images =[
    'https://images.pexels.com/photos/317356/pexels-photo-317356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    'https://images.pexels.com/photos/4977446/pexels-photo-4977446.jpeg',
    'https://images.pexels.com/photos/8062289/pexels-photo-8062289.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/8927650/pexels-photo-8927650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/8297419/pexels-photo-8297419.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/4907440/pexels-photo-4907440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ]
export const handleSavemaps = () => {
  let toSaveData = JSON.parse(window.localStorage.getItem("data"));
  fetch(FIREBASE_URL + "/data.json", {
    method: "POST",
    body: JSON.stringify({ insertDate: new Date(), mapsData: toSaveData }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("Save success response : ", res);
    })
    .catch((e) => {
      console.log("Not able to save maps.");
    });
};
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: repository.getList({ level: 0 }),
      mindMapsAuth: JSON.parse(window.sessionStorage.getItem("mindMapsAuth")),
    };
  }

  add() {
    repository.save({
      name: "Idea!",
      level: 0,
      parentId: null,
      displayShape: SHAPES.BIG_CIRCLE,
    });
    this.setState({ list: repository.getList({ level: 0 }) });
  }

  actionMenu = [
    {
      name: "add",
      onClick: () => this.add(),
      description: "Click here to add a new map in display",
    },
    {
      name: "delete",
      onClick: () => this.delete(this.state.id),
      description: "Click here to delete selected map",
    },
  ];
  actionMenuOnAuth = [
    {
      name: "add",
      onClick: () => this.add(),
      description: "Click here to add a new map in display",
    },
    {
      name: "delete",
      onClick: () => this.delete(this.state.id),
      description: "Click here to delete selected map",
    },
    {
      name: "save",
      onClick: () => handleSavemaps(),
      description: "Click here to save all maps",
    },
  ];

  setSelected(id) {
    this.setState({ id });
  }

  delete(id) {
    repository.delete(id);
    this.setState({ list: repository.getList({ level: 0 }) });
  }

  getMap(id) {
    router.setRoute("map", id);
  }

  render() {
    return (
      <div>
        <div>
          <img
            alt="logo"
            src={logo}
            onClick={() => router.setRoute("home")}
            style={{ cursor: "pointer" }}
          />
          <Button
            variant="warning"
            style={{ float: "right", margin: "15px" }}
            onClick={() => {
              window.sessionStorage.setItem("mindMapsAuth", false);
              setTimeout(() => router.setRoute("login"), 0);
            }}
          >
            LOGOUT
          </Button>
        </div>
        {this.state.mindMapsAuth && (
          <center>
            <h5>Mindmaps</h5>
          </center>
        )}
        <Toolbar
          list={
            this.state.mindMapsAuth ? this.actionMenuOnAuth : this.actionMenu
          }
          type="alert"
          location={["horizontal", "right", "bottom"]}
        />
        {this.state.mindMapsAuth && (
          <div>
            {false && (
              <div style={{ display: "flex", justifyContent: "end" }}>
                <Button onClick={handleSavemaps}>Save maps</Button>
              </div>
            )}
            <div className={css.list}>
              {
                // this.state.list.map(item => (
                repository.getList({ level: 0 }).map((item,indexForImg) => (
                  <div
                    className={css.item}
                    onDoubleClick={() => this.getMap(item.id)}
                    key={item.id}
                  >
                    <Card
                    image={images[indexForImg%10]}
                      id={item.id}
                      onClick={() => this.setSelected(item.id)}
                      isSelected={item.id === this.state.id}
                      name={item.name}
                      comment={item.comment}
                    />
                  </div>
                ))
              }
            </div>
          </div>
        )}
        {!this.state.mindMapsAuth && (
          <div style={{ padding: "20px", margin: "20px" }}>
            <h4>You need to login to see this page</h4>
            <Button onClick={() => router.setRoute("login")}>
              Please Login{" "}
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default Home;
