import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import css from "./chart.module.css";
import ChartElement from "./ChartElement";
import Connection from "./Connection";
import { SHAPES } from "./Map";
import Toolbar from "./Toolbar";

/** https://www.algorithms-and-technologies.com/bfs/javascript
 * Implementation of Breadth-First-Search (BFS) in getDelays
 * This has a runtime of O(|V|^2) (|V| = number of Nodes)
 *
 * @param data an list of JSON objects,each object corresponds to one node in UI
 * @param start the node to start BFS from.
 * @return Array array of input having list of JSON objects which one more property delay added in each node object
 */
function getDelays(data, start) {
  // BFS
  //A Queue to manage the nodes that have yet to be visited
  var queue = [];
  //Adding the node to start from
  queue.push(start);
  //A boolean array indicating whether we have already visited a node
  var visited = {};
  //(The start node is already visited)
  visited[`${start.id}`] = true;
  // Keeping the distances (might not be necessary depending on your use case)
  var distances = {}; // No need to set initial values since every node is visted exactly once
  //(the distance to the start node is 0)
  distances[`${start.id}`] = 0;
  //While there are nodes left to visit...
  let delaysL = {};
  delaysL[`${start.id}`] = 0;
  while (queue.length > 0) {
    console.log("Visited nodes: " + visited);
    console.log("Distances: " + distances);
    var node = queue.shift();
    console.log("Removing node " + node + " from the queue...");
    //...for all neighboring nodes that haven't been visited yet....
    let neighbourNodes = data.filter(
      (x) => x.parent && x.parent.id === node.id
    );
    neighbourNodes.map((iteratingNode, iteratingIndex) => {
      if (Object.keys(visited).indexOf(iteratingNode.id) === -1) {
        visited[`${iteratingNode.id}`] = true;
        distances[`${iteratingNode.id}`] = distances[`${node.id}`] + 1;
        // Find max delay among available delays and increment delay
        let nodesDelay = Math.max(...Object.values(delaysL)) + 500;
        // preserve current delay so that this can be considered while finding max.
        delaysL[`${iteratingNode.id}`] = nodesDelay;
        // Assigning calculated delay into array item.
        iteratingNode.delay = nodesDelay;
        // This way of havin seperate delaysL array, will allow nodes to blink one after other if n nodes are at same level from a parent
        queue.push(iteratingNode);
      }
    });
  }
  console.log("No more nodes in the queue. Distances: " + distances);
  let toReturnData = data.map((x) => {
    // Making all nodes at one level blink once rather one after other - start
    // let distance = distances[`${x.id}`];
    // x.delay = distance ? distance * 100 : 0;
    // Making all nodes at one level blink once rather one after other - end
    return { ...x };
  });

  console.log("Data with delays : ", toReturnData);

  return toReturnData;
}
function determineChilds(parent, elements) {
  return JSON.parse(JSON.stringify(elements)).filter(
    (x) => x.parent && x.parent.id === parent.id
  );
}
let delay = 500;
let newArray = [];
function getDelaysNestingNodesLooped(elements1, parent) {
  //parent.delay = delay;
  let childs = determineChilds(
    JSON.parse(JSON.stringify(parent)),
    JSON.parse(JSON.stringify(elements1))
  );
  if (newArray.filter((x) => x.id === parent.id).length == 0) {
    console.log("Before -> ", JSON.stringify(parent));
    newArray.push(JSON.parse(JSON.stringify({ ...parent, delay: delay })));
    console.log(
      "After--->",
      JSON.stringify(JSON.parse(JSON.stringify({ ...parent, delay: delay })))
    );
  }
  delay = delay + 400;
  childs = JSON.parse(JSON.stringify(childs.sort((a, b) => a.id - b.id)));
  for (let i = 0; i < childs.length; i++) {
    getDelaysNestingNodesLooped(
      JSON.parse(JSON.stringify(elements1)),
      childs[i]
    );
  }
}

function getDelaysNestingNodes(elements, parent) {
  let stack = [];
  let visited = {};
  let delays = {};
  let delay = 100;
  let delayBuff = 600;
  let node = JSON.parse(JSON.stringify(parent));
  //DFS  https://codeburst.io/implementing-dfs-and-bfs-using-javascript-5034f3cee9a1
  stack.push(node);
  while (stack.length !== 0) {
    node = JSON.parse(JSON.stringify(stack.pop()));
    let childrenOfparent = determineChilds(node, elements);
    if (!visited[`${node.id}`]) {
      visited[`${node.id}`] = true;
      node.delay = delay + delayBuff;
      delays[`${node.id}`] = node.delay;
      delay = delay + delayBuff;
      console.log(`we visited ${node.id}`);
      for (let j = 0; j < childrenOfparent.length; j++) {
        stack.push(childrenOfparent[j]);
      }
    }
  }
  console.log("Delays : ", delays);
  return elements.map((x) => {
    return { ...x, delay: delays[`${x.id}`] };
  });
}
function removeDelays(elements) {
  return elements.map((x) => {
    delete x.delay;
    return x;
  });
}
function Chart(props) {
  const [bddView, SetBddView] = useState(false);
  const [manualView, setManualView] = useState(false);
  const WIDTH = props.width / props.zoom;
  const HEIGHT = props.height / props.zoom;
  const R = 95;
  let newVar = 5;
  let newVarY = 3;

  const getChildren = (list, parent, elements, dPhi) => {
    const children = list.filter((item) => item.parentId === parent.id);
    for (let i = 0; i < children.length; i++) {
      let item = children[i];
      let phi = (i * dPhi) / children.length + parent.phi;
      const isLeftSide = phi > Math.PI / 2.5 && phi < (3 * Math.PI) / 2;
      const element = {
        id: item.id,
        name: item.name,
        level: item.level,
        x:
          (item.displayShape === SHAPES.ARROW ? 1.075 * parent.x : parent.x) +
          R * Math.cos(phi) +
          (phi > Math.PI / 2 && phi < (3 * Math.PI) / 2 ? -newVar : +newVar),
        y:
          parent.y +
          R * Math.sin(phi) +
          (phi > Math.PI / 2 && phi < (3 * Math.PI) / 2 ? -newVarY : +newVarY),
        phi,
        px: parent.x,
        py: parent.y,
        isLeftSide,
        displayShape: item.displayShape,
        condition: item.condition,
        parent: parent,
        inputsList: item.inputsList,
      };
      if (item.length > 3) {
        newVar = newVar + 5;
        newVarY = newVarY + 3;
      }
      elements.push(element);
      let shapeBasedDPhi = dPhi;
      // if(element.displayShape===SHAPES.ARROW){
      //     shapeBasedDPhi=15;
      // }else if(element.displayShape===SHAPES.NODE){
      //     shapeBasedDPhi=1.75;
      // }else if(element.displayShape===SHAPES.RECTANGLE){
      //     shapeBasedDPhi = 2.4;
      // }else if(element.displayShape===SHAPES.RHOMBUS){
      //     shapeBasedDPhi=4.7
      // }
      getChildren(list, element, elements, shapeBasedDPhi / children.length);
    }
  };

  const setElements = (list) => {
    const elements = [];
    const x0 = WIDTH / 2;
    const y0 = HEIGHT / 2;
    const root = list.find((item) => item.level === 0);
    const rootElement = {
      id: root.id,
      name: root.name,
      level: root.level,
      x: x0,
      y: y0,
      phi: 0,
      displayShape: root.displayShape,
    };
    elements.push(rootElement);
    getChildren(list, rootElement, elements, 2.5 * Math.PI);
    return elements;
  };

  const zoomMenu = [
    { name: "bdd", onClick: (e) => SetBddView(true),description:'Click here to view BDD Scenarios' },
    { name: "manual", onClick: (e) => setManualView(true), description:'Click here to view manual test Scenarios' },
    { name: "zoomIn", onClick: (e) => props.onZoomIn(e) ,description:'Click here to Zoom In'},
    { name: "zoomOut", onClick: (e) => props.onZoomOut(e),description:'Click here to Zoom Out' },
    { name: "panTool", onClick: props.onToggleMoveMode ,description:'Click here to drag and view'},
    {
      name: props.runAnimation ? "stop" : "play",
      onClick: (e) => props.onAnimate(),
    },
  ];
  const determinePaths = (elements) => {
    let leaves = elements.filter(
      (x) => elements.filter((y) => y.parent?.id === x.id).length === 0
    );
    let paths = [];
    let delay = 100;
    leaves.map((leaf) => {
      let iteratingLeaf = JSON.parse(JSON.stringify(leaf));
      let currentLeafPath = [iteratingLeaf];
      do {
        let currentsParent = elements.filter(
          (p) => p.id === iteratingLeaf.parent.id
        );
        currentLeafPath.push(currentsParent[0]);
        iteratingLeaf = JSON.parse(JSON.stringify(currentsParent[0]));
      } while (iteratingLeaf.parent);
      currentLeafPath.push(iteratingLeaf); // root will not have parent and loop stops with out adding root node
      paths.push(
        currentLeafPath.reverse().map((x) => {
          delay = delay + 500;
          x.delay = delay;
          return JSON.parse(JSON.stringify(x));
        })
      );
      //   console.log("currentLeafPath : ", leaf.name, currentLeafPath);
    });

    const PREFIX_TEXT = {
      GO_TO: "Go to ",
      ENTER_USER_INPUTS: " Enter user inputs as ",
      AFTER: " after ",
      VALIDATION: " check ",
      CLICK: "Click ",
      LOADS: "loads ",
      ON_SUCCESS: "on success, ",
      ON_FAILURE: "on failure, ",
    };
    let testCases = [];
    paths.map((item) => {
      console.log("Current item : ", item);
      let nodes = JSON.parse(JSON.stringify(item.slice(1, item.length)));
      let currentCase = "";
      nodes.map((node, index) => {
        if (node.displayShape === SHAPES.BIG_CIRCLE) {
          if (node.condition === "TRUE") {
            // This has to be applied in all SHAPES nodes
            //parent is rhombus and this is true case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_SUCCESS +
              PREFIX_TEXT.GO_TO +
              node.name +
              ", ";
          } else if (node.condition === "FALSE") {
            //parent is rhombus and this is false case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_FAILURE +
              PREFIX_TEXT.GO_TO +
              node.name +
              ", ";
          } else {
            // parent is not rombus
            currentCase = currentCase + PREFIX_TEXT.GO_TO + node.name + ", ";
          }
        } else if (node.displayShape === SHAPES.ARROW) {
          let ipsString = "";
          node.inputsList.map((ip) => {
            ipsString = ipsString + ip.key + " : " + ip.value + "; ";
          });
          if (node.condition === "TRUE") {
            // This has to be applied in all SHAPES nodes
            //parent is rhombus and this is true case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_SUCCESS +
              PREFIX_TEXT.ENTER_USER_INPUTS +
              ipsString +
              ", ";
          } else if (node.condition === "FALSE") {
            //parent is rhombus and this is false case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_FAILURE +
              PREFIX_TEXT.ENTER_USER_INPUTS +
              ipsString +
              ", ";
          } else {
            // parent is not rombus

            currentCase =
              currentCase + PREFIX_TEXT.ENTER_USER_INPUTS + ipsString + ", ";
          }
        } else if (node.displayShape === SHAPES.RHOMBUS) {
          if (node.condition === "TRUE") {
            // This has to be applied in all SHAPES nodes
            //parent is rhombus and this is true case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_SUCCESS +
              PREFIX_TEXT.AFTER +
              node.name +
              PREFIX_TEXT.VALIDATION +
              ", ";
          } else if (node.condition === "FALSE") {
            //parent is rhombus and this is false case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_FAILURE +
              PREFIX_TEXT.AFTER +
              node.name +
              PREFIX_TEXT.VALIDATION +
              ", ";
          } else {
            // parent is not rombus
            currentCase =
              currentCase +
              PREFIX_TEXT.AFTER +
              node.name +
              PREFIX_TEXT.VALIDATION +
              ", ";
          }
        } else if (node.displayShape === SHAPES.RECTANGLE) {
          if (node.condition === "TRUE") {
            // This has to be applied in all SHAPES nodes
            //parent is rhombus and this is true case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_SUCCESS +
              PREFIX_TEXT.CLICK +
              node.name +
              ", ";
          } else if (node.condition === "FALSE") {
            //parent is rhombus and this is false case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_FAILURE +
              PREFIX_TEXT.CLICK +
              node.name +
              ", ";
          } else {
            // parent is not rombus
            currentCase = currentCase + PREFIX_TEXT.CLICK + node.name + ", ";
          }
        } else if (node.displayShape === SHAPES.NODE) {
          if (node.condition === "TRUE") {
            // This has to be applied in all SHAPES nodes
            //parent is rhombus and this is true case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_SUCCESS +
              PREFIX_TEXT.LOADS +
              node.name +
              ", ";
          } else if (node.condition === "FALSE") {
            //parent is rhombus and this is false case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT.ON_FAILURE +
              PREFIX_TEXT.LOADS +
              node.name +
              ", ";
          } else {
            // parent is not rombus
            currentCase = currentCase + PREFIX_TEXT.LOADS + node.name + ", ";
          }
        }
      });
      testCases.push(currentCase);
    });
    console.log(" cases strin : ", testCases);
    return { paths: paths, testCases };
  };
  const renderScenario = (path) => {
    return path.split(",").map((phrase) => {
      return (
        <>
          {phrase}
          <br />
        </>
      );
    });
  };
  const triggerBrowserPrint = (printableDivId) => {
    let mywindow = window.open(
      "",
      "PRINT",
      "height=650,width=900,top=100,left=150"
    );

    mywindow.document.write(`<html><head><title>${"Scenarios"}</title>`);
    mywindow.document.write("</head><body >");
    mywindow.document.write(document.getElementById(printableDivId).innerHTML);
    mywindow.document.write("</body></html>");

    mywindow.document.close();
    mywindow.focus();
    mywindow.print();
    mywindow.close();
  };
  const determinePathsAsInCucumber = (elements) => {
    let leaves = elements.filter(
      (x) => elements.filter((y) => y.parent?.id === x.id).length === 0
    );
    let paths = [];
    let delay = 100;
    leaves.map((leaf) => {
      let iteratingLeaf = JSON.parse(JSON.stringify(leaf));
      let currentLeafPath = [iteratingLeaf];
      do {
        let currentsParent = elements.filter(
          (p) => p.id === iteratingLeaf.parent.id
        );
        currentLeafPath.push(currentsParent[0]);
        iteratingLeaf = JSON.parse(JSON.stringify(currentsParent[0]));
      } while (iteratingLeaf.parent);
      currentLeafPath.push(iteratingLeaf); // root will not have parent and loop stops with out adding root node
      paths.push(
        currentLeafPath.reverse().map((x) => {
          delay = delay + 500;
          x.delay = delay;
          return JSON.parse(JSON.stringify(x));
        })
      );
      //   console.log("currentLeafPath : ", leaf.name, currentLeafPath);
    });
    const CUCUM_WORDS = {
      FEATURE: "Feature ",
      SCENARIO: "Scenario ",
      GIVEN: "Given ",
      THEN: "Then ",
      WHEN: "When ",
      AND: "And ",
    };
    const PREFIX_TEXT_CUCUMBER = {
      GO_TO: "Go to ",
      WHEN: CUCUM_WORDS.WHEN + " user enters ",
      AFTER: " after ",
      VALIDATION: "",
      CLICK: CUCUM_WORDS.AND + " user clicks ",
      LOADS: " loads ",
      given: CUCUM_WORDS.GIVEN + "Navigate to  ",
      and: CUCUM_WORDS.AND + " on ",
      then: "Then ",
    };

    let testCases = [];
    paths.map((item) => {
      console.log("Current item : ", item);
      let nodes = JSON.parse(JSON.stringify(item.slice(1, item.length)));
      let currentCase = "";
      let currentCaseList = [];
      nodes.map((node, index) => {
        if (node.displayShape === SHAPES.BIG_CIRCLE) {
          if (node.condition === "TRUE") {
            // This has to be applied in all SHAPES nodes
            //parent is rhombus and this is true case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT_CUCUMBER.then +
              PREFIX_TEXT_CUCUMBER.GO_TO +
              node.name +
              ", ";
          } else if (node.condition === "FALSE") {
            //parent is rhombus and this is false case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT_CUCUMBER.then +
              PREFIX_TEXT_CUCUMBER.GO_TO +
              node.name +
              ", ";
          } else {
            // parent is not rombus
            currentCase =
              currentCase + PREFIX_TEXT_CUCUMBER.given + node.name + ", ";
          }
        } else if (node.displayShape === SHAPES.ARROW) {
          let ipsString = "";
          node.inputsList.map((ip) => {
            ipsString = ipsString + ip.key + " : " + ip.value + "; ";
          });
          if (node.condition === "TRUE") {
            // This has to be applied in all SHAPES nodes
            //parent is rhombus and this is true case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT_CUCUMBER.then +
              PREFIX_TEXT_CUCUMBER.WHEN +
              ipsString +
              ", ";
          } else if (node.condition === "FALSE") {
            //parent is rhombus and this is false case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT_CUCUMBER.then +
              PREFIX_TEXT_CUCUMBER.WHEN +
              ipsString +
              ", ";
          } else {
            // parent is not rombus

            currentCase =
              currentCase + PREFIX_TEXT_CUCUMBER.WHEN + ipsString + ", ";
          }
        } else if (node.displayShape === SHAPES.RHOMBUS) {
          if (node.condition === "TRUE") {
            // This has to be applied in all SHAPES nodes
            //parent is rhombus and this is true case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT_CUCUMBER.then +
              PREFIX_TEXT_CUCUMBER.and +
              node.name +
              PREFIX_TEXT_CUCUMBER.VALIDATION +
              ", ";
          } else if (node.condition === "FALSE") {
            //parent is rhombus and this is false case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT_CUCUMBER.then +
              PREFIX_TEXT_CUCUMBER.and +
              node.name +
              PREFIX_TEXT_CUCUMBER.VALIDATION +
              ", ";
          } else {
            // parent is not rombus
            currentCase =
              currentCase +
              PREFIX_TEXT_CUCUMBER.and +
              node.name +
              PREFIX_TEXT_CUCUMBER.VALIDATION +
              ", ";
          }
        } else if (node.displayShape === SHAPES.RECTANGLE) {
          if (node.condition === "TRUE") {
            // This has to be applied in all SHAPES nodes
            //parent is rhombus and this is true case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT_CUCUMBER.then +
              PREFIX_TEXT_CUCUMBER.CLICK +
              node.name +
              ", ";
          } else if (node.condition === "FALSE") {
            //parent is rhombus and this is false case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT_CUCUMBER.then +
              PREFIX_TEXT_CUCUMBER.CLICK +
              node.name +
              ", ";
          } else {
            // parent is not rombus
            currentCase =
              currentCase + PREFIX_TEXT_CUCUMBER.CLICK + node.name + ", ";
          }
        } else if (node.displayShape === SHAPES.NODE) {
          if (node.condition === "TRUE") {
            // This has to be applied in all SHAPES nodes
            //parent is rhombus and this is true case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT_CUCUMBER.then +
              PREFIX_TEXT_CUCUMBER.LOADS +
              node.name +
              ", ";
          } else if (node.condition === "FALSE") {
            //parent is rhombus and this is false case scenario
            currentCase =
              currentCase +
              PREFIX_TEXT_CUCUMBER.then +
              PREFIX_TEXT_CUCUMBER.LOADS +
              node.name +
              ", ";
          } else {
            // parent is not rombus
            currentCase =
              currentCase + PREFIX_TEXT_CUCUMBER.LOADS + node.name + ", ";
          }
        }
      });
      testCases.push(currentCase);
    });
    console.log(" cases strin : ", testCases);
    return { paths: paths, testCases };
  };

  let elements = setElements(props.list);
  if (props.runAnimation) {
    // DO NOT REMOVE
    // elements = getDelays(elements, elements[0]);
    // elements = getDelaysNestingNodes(elements,elements[0]);
    // elements = getDelaysNestingNodes(elements, elements[0]);
    console.log("Paths : ", determinePaths(elements));
    newArray = [];
    delay = 100;
    getDelaysNestingNodesLooped(
      JSON.parse(JSON.stringify(elements)),
      JSON.parse(JSON.stringify(elements[0]))
    );
    elements = JSON.parse(JSON.stringify(newArray));
    elements = elements.sort((a, b) => a.delay - b.delay);
    console.log(elements.map((x) => x.name + " -->" + x.delay));
    // determinePaths(elements)
  } else {
    elements = removeDelays(elements);
  }

  return (
    <div className={css.container}>
      <Toolbar
        list={zoomMenu}
        type="default"
        location={["horizontal", "right", "top"]}
      />
      {false && !props.runAnimation && (
        <svg
          viewBox={`${props.x} ${props.y} ${WIDTH} ${HEIGHT}`}
          onMouseDown={(e) => props.onMouseDown(e)}
          onMouseMove={(e) => props.onMouseMove(e)}
          onMouseUp={() => props.onMouseUp()}
        >
          <Connection list={elements} />
          {elements.map((element) => {
            return (
              <ChartElement
                key={element.id}
                onClick={props.onClick}
                id={element.id}
                phi={element.phi}
                level={element.level}
                x={element.x}
                y={element.y}
                isSelected={element.id === props.id}
                px={element.px}
                py={element.py}
                name={element.name}
                displayShape={element.displayShape}
                condition={element.condition}
                parent={element.parent}
                delay={element.delay}
                runAnimation={props.runAnimation}
                inputsList={props.inputsList}
              />
            );
          })}
        </svg>
      )}

      <div></div>
      <div>
        <svg
          viewBox={`${props.x} ${props.y} ${WIDTH} ${HEIGHT}`}
          onMouseDown={(e) => props.onMouseDown(e)}
          onMouseMove={(e) => props.onMouseMove(e)}
          onMouseUp={() => props.onMouseUp()}
        >
          <Connection list={elements} />
          {elements.map((element) => {
            return (
              <ChartElement
                key={element.id}
                onClick={props.onClick}
                id={element.id}
                phi={element.phi}
                level={element.level}
                x={element.x}
                y={element.y}
                isSelected={element.id === props.id}
                px={element.px}
                py={element.py}
                name={element.name}
                displayShape={element.displayShape}
                condition={element.condition}
                parent={element.parent}
                delay={element.delay}
                runAnimation={props.runAnimation}
                inputsList={element.inputsList}
                pathsForPlayAnimation={
                  props.runAnimation &&
                  determinePaths(elements) &&
                  determinePaths(elements).paths
                    ? determinePaths(elements).paths
                    : []
                }
              />
            );
          })}
        </svg>
        {props.runAnimation && (
          <div>
            <div>
              {false &&
                determinePaths(elements) &&
                determinePaths(elements).paths &&
                determinePaths(elements).paths.length > 0 &&
                determinePaths(elements).paths?.map((x, i) => {
                  return (
                    <div>
                      <b style={{ color: "magenta" }}>
                        Scenario {i + 1} ) {x[x.length - 1].name} is :{" "}
                      </b>
                      <span style={{ color: "blue" }}>
                        {x
                          .slice(1)
                          .map((p) => {
                            if (p.displayShape === SHAPES.ARROW) {
                              return (
                                "Inputs as : " +
                                p.inputsList
                                  .map((x) => x.key + " : " + x.value)
                                  .join(" || ")
                              );
                            } else {
                              return p.name;
                            }
                          })
                          .join(" -->> ")}
                      </span>
                    </div>
                  );
                })}
            </div>

            <div style={{ color: "orange" }}>
              Animation order :
              {elements.map((x) => {
                return (
                  <span>
                    {" "}
                    {x.name} {"--->"}
                  </span>
                );
              })}
            </div>
          </div>
        )}
        {bddView && (
          <div>
            {/* Cucumber stuff */}
            <Modal size="lg" show={bddView} onHide={() => SetBddView(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Cucumber scenarios </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
                <div id="bddView">
                  <ul>
                    {determinePathsAsInCucumber(elements) &&
                      determinePathsAsInCucumber(elements).testCases &&
                      determinePathsAsInCucumber(elements).testCases.length >
                        0 &&
                      determinePathsAsInCucumber(elements).testCases?.map(
                        (path, i) => {
                          return (
                            <li type="none" style={{ color: "green" }}>
                              <h5 style={{ color: "blue" }}>
                                Scenario: {i}
                              </h5>
                              {renderScenario(path)}
                            </li>
                          );
                        }
                      )}
                  </ul>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    triggerBrowserPrint("bddView");
                  }}
                >
                  Download
                </Button>
                <Button variant="primary" onClick={() => SetBddView(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Cucumber stuff ends */}
          </div>
        )}
        {manualView && (
          <div>
            {/* Cucumber stuff */}
            <Modal
              size="lg"
              show={manualView}
              onHide={() => setManualView(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Test cases </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
                <div id="manualView">
                  <div>
                    <ul>
                      {determinePaths(elements) &&
                        determinePaths(elements).testCases &&
                        determinePaths(elements).testCases.length > 0 &&
                        determinePaths(elements).testCases?.map((x, i) => {
                          return (
                            <li type="square" style={{ color: "green" }}>
                              {x}
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    triggerBrowserPrint("manualView");
                  }}
                >
                  Download
                </Button>
                <Button variant="primary" onClick={() => setManualView(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Cucumber stuff ends */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Chart;
