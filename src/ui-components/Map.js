import React from "react";
import repository from "../repository";
import Details from "./Details";
import router from "./router";
import css from "./map.module.css";
import Toolbar from "./Toolbar";
import TableView from "./TableView";
import Chart from "./Chart";
import { v4 as uuidv4 } from "uuid";
import { handleSavemaps } from "./Home";
export const SHAPES = {
  BIG_CIRCLE: "BIG_CIRCLE",
  RECTANGLE: "RECTANGLE",
  RHOMBUS: "RHOMBUS",
  NODE: "NODE",
  ARROW: "ARROW",
};
class Map extends React.Component {
  DEFAULT_WIDTH = 400;
  DEFAULT_HEIGHT = 200;
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
    const rootId = Number(router.getParams());
    const list = repository.getList({ rootId });
    const item = list[0];
    this.state = {
      id: item.id,
      name: item.name,
      level: item.level,
      comment: item.comment,
      displayShape: item.displayShape,
      rootId,
      list,
      zoom: 1,
      moveMode: false,
      x: 0,
      y: 0,
      width: this.DEFAULT_WIDTH,
      height: this.DEFAULT_HEIGHT,
      condition: item.condition,
      parentId: item.parentId,
      runAnimation: false,
    };
  }

  onResize = () => {
    const width = this.wrapper.current.clientWidth;
    const height = this.wrapper.current.clientHeight;
    this.setState({ width, height });
  };

  componentDidMount() {
    this.onResize();
    window.addEventListener("resize", this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  toggleMoveMode = () => {
    const moveMode = !this.state.moveMode;

    handleSavemaps()

    this.setState({ moveMode });
  };

  ZOOM_FACTOR = 1.1;

  zoomIn = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const zoom = this.state.zoom * this.ZOOM_FACTOR;
    handleSavemaps()
    this.setState({ zoom });
  };

  zoomOut = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const zoom = this.state.zoom / this.ZOOM_FACTOR;
    handleSavemaps()
    this.setState({ zoom });
  };
  onAnimate = () => {
    this.setState({ runAnimation: !this.state.runAnimation });
  };
  setSelected = (id) => {
    const item = repository.getItem(id);
    this.setState({
      id: item.id,
      level: item.level,
      name: item.name,
      comment: item.comment,
      displayShape: item.displayShape,
      condition: item.condition,
      inputsList: item.inputsList,
    });
  };

  changeName = (e) => {
    const name = e.target.value;
    const item = { id: this.state.id, name };
    repository.save(item);
    const list = repository.getList({ rootId: this.state.rootId });
    this.setState({ name, list });
  };
  changeShape = (e) => {
    const displayShape = e.target.value;
    const item = { id: this.state.id, displayShape };
    repository.save(item);
    const list = repository.getList({ rootId: this.state.rootId });
    this.setState({ displayShape, list });
  };
  invertConditionalFlows = () => {
    const childrenForRhombus = repository.getList({ parentId: this.state.id });
    if (
      childrenForRhombus &&
      childrenForRhombus[0] &&
      childrenForRhombus[0].condition
    ) {
      if (childrenForRhombus[0].condition === "TRUE") {
        const item = { id: childrenForRhombus[0].id, condition: "FALSE" };
        repository.save(item);
        const list = repository.getList({ rootId: this.state.rootId });
        this.setState({ list });
      } else if (childrenForRhombus[0].condition === "FALSE") {
        const item = { id: childrenForRhombus[0].id, condition: "TRUE" };
        repository.save(item);
        const list = repository.getList({ rootId: this.state.rootId });
        this.setState({ list });
      }
    }
    if (
      childrenForRhombus &&
      childrenForRhombus[1] &&
      childrenForRhombus[1].condition
    ) {
      if (childrenForRhombus[0].condition === "TRUE") {
        const item = { id: childrenForRhombus[1].id, condition: "FALSE" };
        repository.save(item);
        const list = repository.getList({ rootId: this.state.rootId });
        this.setState({ list });
      } else if (childrenForRhombus[0].condition === "FALSE") {
        const item = { id: childrenForRhombus[1].id, condition: "TRUE" };
        repository.save(item);
        const list = repository.getList({ rootId: this.state.rootId });
        this.setState({ list });
      }
    }
    console.log(childrenForRhombus);
  };
  // setSelected = (id) => {
  //     const item = repository.getItem(id);
  //     this.setState({
  //         id: item.id,
  //         name: item.name,
  //         level: item.level,
  //         comment: item.comment,
  //         displayShape: item.displayShape,
  //         condition: item.condition
  //     });
  // };
  updateInputsValues = (e, field, index) => {
    const item = repository.getItem(this.state.id);
    let inputsList = item.inputsList;
    inputsList[index][field] = e.target.value;
    repository.save({ ...JSON.parse(JSON.stringify(item)) });
    this.setState({ inputsList: [...inputsList] });
    this.setState({ list: repository.getList({ rootId: this.state.rootId }) })
  };
  updateInputs = ({ pointer, op }) => {
    const item = repository.getItem(this.state.id);
    let inputsList = item.inputsList;
    if (!inputsList || inputsList.length === 0) {
      if (op === "ADD") {
        inputsList = [{ key: "", value: "", inputId: uuidv4() }];
      }
    } else {
      if (op === "ADD") {
        inputsList.push({ key: "", value: "", inputId: uuidv4() });
      } else if (op === "REMOVE") {
        inputsList.splice(pointer, 1);
      }
    }
    item.inputsList = JSON.parse(JSON.stringify(inputsList))
    repository.save({ ...JSON.parse(JSON.stringify(item)) });
    // const list = repository.getList({ rootId: this.state.rootId });
    this.setState({ inputsList: [...inputsList] });
    this.setState({ list: repository.getList({ rootId: this.state.rootId }) })
  };

  changeComment = (e) => {
    const comment = e.target.value;
    const item = { id: this.state.id, comment };
    repository.save(item);
    this.setState({ comment });
  };

  actionList = [
    { name: "add", onClick: () => this.add() },
    { name: "delete", onClick: () => this.delete() },
  ];
  determineDefaultDisplayShape(level) {
    if (level === 1) {
      return SHAPES.RHOMBUS;
    } else if (level === 2) {
      return SHAPES.RECTANGLE;
    } else if (level === 3) {
      return SHAPES.NODE;
    }
    return SHAPES.NODE;
  }
  addNewElementAndSetState(condition) {
    const item = repository.save({
      name: "New item",
      level: this.state.level + 1,
      rootId: this.state.rootId,
      parentId: this.state.id,
      comment: "",
      displayShape: this.determineDefaultDisplayShape(this.state.level + 1),
      condition: condition ? condition : null,
    });
    const list = repository.getList({ rootId: this.state.rootId });
    this.setState({
      id: item.id,
      name: item.name,
      level: item.level,
      comment: item.comment,
      displayShape: item.displayShape,
      list,
      condition,
      parentId: item.parentId,
      inputsList: item.inputsList,
    });
  }
  add() {
    // const {addNewElementAndSetState}=this;
    if (this.state.displayShape === SHAPES.RHOMBUS) {
      const childern = repository.getList({ parentId: this.state.id });
      if (!childern || childern.length === 0) {
        this.addNewElementAndSetState("TRUE");
      } else if (childern && childern.length === 1) {
        if (childern[0].condition === "TRUE") {
          this.addNewElementAndSetState("FALSE");
        } else {
          this.addNewElementAndSetState("TRUE");
        }
      }
    } else {
      this.addNewElementAndSetState(null);
    }
  }

  onMouseDown = (e) => {
    if (!this.state.moveMode) {
      return;
    }
    this.isDragging = true;
    this.startX = this.state.x * this.state.zoom + e.clientX;
    this.startY = this.state.y * this.state.zoom + e.clientY;
  };

  onMouseMove = (e) => {
    if (!this.isDragging) {
      return;
    }
    e.preventDefault();
    const x = (this.startX - e.clientX) * this.state.zoom;
    const y = (this.startY - e.clientY) * this.state.zoom;
    this.setState({ x, y });
  };

  onMouseUp = () => {
    this.isDragging = false;
  };

  delete = () => {
    repository.delete(this.state.id);
    const list = repository.getList({ rootId: this.state.rootId });
    if (!list.length) {
      router.setRoute("home");
      return;
    }
    const item = list[0];
    this.setState({
      id: item.id,
      name: item.id,
      level: item.level,
      comment: item.comment,
      displayShape: item.displayShape,
      list,
      condition: item.condition,
    });
  };

  viewMenu = [
    { name: "viewList", onClick: () => this.setState({ view: "table" }) },
    { name: "hive", onClick: () => this.setState({ view: "chart" }) },
  ];

  render() {
    let view;
    if (this.state.view === "table") {
      view = (
        <TableView
          id={this.state.id}
          onClick={this.setSelected}
          list={this.state.list}
          displayShape={this.state.displayShape}
          condition={this.state.condition}
        />
      );
    } else {
      view = (
        <Chart
          id={this.state.id}
          zoom={this.state.zoom}
          onZoomIn={this.zoomIn}
          onZoomOut={this.zoomOut}
          onToggleMoveMode={this.toggleMoveMode}
          x={this.state.x}
          y={this.state.y}
          width={this.state.width}
          height={this.state.height}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onClick={this.setSelected}
          list={this.state.list}
          displayShape={this.state.displayShape}
          condition={this.state.condition}
          runAnimation={this.state.runAnimation}
          onAnimate={this.onAnimate}
          inputsList={this.state.inputsList}
        />
      );
    }
    return (
      <>
        <h1>Map</h1>
        <div className={css.container} ref={this.wrapper}>
          {view}
          <Toolbar
            type="alert"
            location={["right", "bottom", "vertical"]}
            list={this.actionList}
          />
        </div>
        <Toolbar
          list={this.viewMenu}
          type="default"
          location={["vertical", "left", "bottom"]}
        />
        <Details
          id={this.state.id}
          level={this.state.level}
          displayShape={this.state.displayShape}
          name={this.state.name}
          condition={this.state.condition}
          inputsList={this.state.inputsList}
          onChangeName={this.changeName}
          onChangeShape={this.changeShape}
          onChangeComment={this.changeComment}
          comment={this.state.comment}
          invertConditionalFlows={this.invertConditionalFlows}
          updateInputs={this.updateInputs}
          updateInputsValues={this.updateInputsValues}
        />
      </>
    );
  }
}

export default Map;
