import css from "./chart.module.css";
import ChartElement from "./ChartElement";
import Connection from "./Connection";
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
        let neighbourNodes = data.filter(x => x.parent && x.parent.id === node.id);
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
                queue.push(iteratingNode)
            }
        })
    }
    console.log("No more nodes in the queue. Distances: " + distances);
    let toReturnData = data.map(x => {
        // Making all nodes at one level blink once rather one after other - start
        // let distance = distances[`${x.id}`];
        // x.delay = distance ? distance * 100 : 0;
        // Making all nodes at one level blink once rather one after other - end
        return { ...x }
    });

    console.log("Data with delays : ", toReturnData);

    return toReturnData;

}
function removeDelays(elements) {
    return elements.map(x => {
        delete x.delay;
        return x;
    })
}
function Chart(props) {
    const WIDTH = props.width / props.zoom;
    const HEIGHT = props.height / props.zoom;
    const R = 90;

    const getChildren = (list, parent, elements, dPhi) => {
        const children = list.filter(item => item.parentId === parent.id);
        for (let i = 0; i < children.length; i++) {
            let item = children[i];
            let phi = i * dPhi / children.length + parent.phi;
            const isLeftSide = (phi > Math.PI / 2) && (phi < 3 * Math.PI / 2);
            const element = {
                id: item.id,
                name: item.name,
                level: item.level,
                x: parent.x + R * Math.cos(phi),
                y: parent.y + R * Math.sin(phi),
                phi,
                px: parent.x,
                py: parent.y,
                isLeftSide,
                displayShape: item.displayShape,
                condition: item.condition,
                parent: parent
            };
            elements.push(element);
            getChildren(list, element, elements, dPhi / children.length);
        }
    };

    const setElements = (list) => {
        const elements = [];
        const x0 = WIDTH / 2;
        const y0 = HEIGHT / 2;
        const root = list.find(item => item.level === 0);
        const rootElement = {
            id: root.id,
            name: root.name,
            level: root.level,
            x: x0,
            y: y0,
            phi: 0,
            displayShape: root.displayShape
        };
        elements.push(rootElement);
        getChildren(list, rootElement, elements, 2.5 * Math.PI);
        return elements;
    };

    const zoomMenu = [
        { name: 'zoomIn', onClick: (e) => props.onZoomIn(e) },
        { name: 'zoomOut', onClick: (e) => props.onZoomOut(e) },
        { name: 'panTool', onClick: props.onToggleMoveMode },
        { name: props.runAnimation ? 'stop':'play', onClick: (e) => props.onAnimate() }
    ];

    let elements = setElements(props.list);
    if (props.runAnimation) {
        elements = getDelays(elements, elements[0]);
    } else {
        elements = removeDelays(elements)
    }
    return (
        <div className={css.container}>
            <Toolbar list={zoomMenu} type="default" location={['horisontal', 'right', 'top']} />
            <svg viewBox={`${props.x} ${props.y} ${WIDTH} ${HEIGHT}`}
                onMouseDown={(e) => props.onMouseDown(e)}
                onMouseMove={(e) => props.onMouseMove(e)}
                onMouseUp={() => props.onMouseUp()}>
                <Connection list={elements} />
                {
                    elements.map(element => {
                        return ((
                            <ChartElement
                                key={element.id}
                                onClick={props.onClick}
                                id={element.id}
                                phi={element.phi}
                                level={element.level}
                                x={element.x} y={element.y}
                                isSelected={element.id === props.id}
                                px={element.px} py={element.py}
                                name={element.name}
                                displayShape={element.displayShape}
                                condition={element.condition}
                                parent={element.parent}
                                delay={element.delay}
                                runAnimation={props.runAnimation}
                                inputsList={props.inputsList} />
                        ))
                    }
                    )
                }
            </svg>
        </div>
    );
}

export default Chart;
