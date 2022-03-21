import css from "./chart.module.css";
import ChartElement from "./ChartElement";
import Connection from "./Connection";
import Toolbar from "./Toolbar";

/**
* Implementation of Breadth-First-Search (BFS) using adjacency matrix.
* This returns nothing (yet), it is meant to be a template for whatever you want to do with it,
* e.g. finding the shortest path in a unweighted graph.
* This has a runtime of O(|V|^2) (|V| = number of Nodes), for a faster implementation see @see ../fast/BFS.java (using adjacency Lists)
*
* @param graph an adjacency-matrix-representation of the graph where (x,y) is true if the the there is an edge between nodes x and y.
* @param start the node to start from.
* @return Array array containing the shortest distances from the given start node to each other node
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
    while (queue.length > 0) {
        console.log("Visited nodes: " + visited);
        console.log("Distances: " + distances);
        var node = queue.shift();
        console.log("Removing node " + node + " from the queue...");
        //...for all neighboring nodes that haven't been visited yet....
        let neighbourNodes = data.filter(x => x.parent && x.parent.id === node.id);
        neighbourNodes.map(iteratingNode => {
            if (Object.keys(visited).indexOf(iteratingNode.id) === -1) {
                visited[`${iteratingNode.id}`] = true;
                distances[`${iteratingNode.id}`] = distances[`${node.id}`] + 1;
                queue.push(iteratingNode)
            }
        })
        // for (var i = 1; i < neighbourNodes.length; i++) {
        //     if (graph[node][i] && !visited[i]) {
        //         // Do whatever you want to do with the node here.
        //         // Visit it, set the distance and add it to the queue
        //         visited[i] = true;
        //         distances[i] = distances[node] + 1;
        //         queue.push(i);
        //         console.log("Visiting node " + i + ", setting its distance to " + distances[i] + " and adding it to the queue");

        //     }
        // }
    }
    console.log("No more nodes in the queue. Distances: " + distances);
    let toReturnData = data.map(x => {
        let distance = distances[`${x.id}`];
        x.delay = distance ? distance * 100 : 0;
        return x;
    });
    console.log("Data with delays : ",toReturnData);
    return toReturnData;

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
        { name: 'play', onClick: (e) => props.onAnimate(true) }
    ];

    let elements = setElements(props.list);
    if (props.runAnimation) {
        elements = getDelays(elements, elements[0]);
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
                                delay={element.delay} />
                        ))
                    }
                    )
                }
            </svg>
        </div>
    );
}

export default Chart;
