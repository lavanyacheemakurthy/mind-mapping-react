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
  delay = delay + 500;
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
    { name: "zoomIn", onClick: (e) => props.onZoomIn(e) },
    { name: "zoomOut", onClick: (e) => props.onZoomOut(e) },
    { name: "panTool", onClick: props.onToggleMoveMode },
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
    return paths;
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

      <div>
        {false && props.runAnimation && (
          <div>
            {determinePaths(elements)?.map((x) => {
              return (
                <div>
                  Path for {x[x.length - 1].name} is :{" "}
                  {x
                    .slice(1)
                    .map((p) => p.name)
                    .join(" -> ")}
                </div>
              );
            })}
          </div>
        )}
      </div>
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
                  props.runAnimation ? determinePaths(elements) : []
                }
              />
            );
          })}
        </svg>
        {props.runAnimation && (
          <div>
            <div>
              {elements.map((x) => {
                return (
                  <span>
                    {" "}
                    {x.name} {"--->"}
                  </span>
                );
              })}
            </div>
            {determinePaths(elements)?.map((x) => {
              return (
                <div>
                  Path for {x[x.length - 1].name} is :{" "}
                  {x
                    .slice(1)
                    .map((p) => p.name)
                    .join(" -->> ")}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Chart;
