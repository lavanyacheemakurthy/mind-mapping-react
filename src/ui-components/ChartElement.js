import css from "./chartelement.module.css";
import { SHAPES } from "./Map";
const BIG_CIRCLE_RADIUS = 40;
const RHOMBUS_HALF_DIAMETER = 30;
const ARROW_LINE_LENGTH = 25;
function determinePointsbasedOnDirection(x, y, x1, y1, direction) {
    switch (direction) {
        case 'UP':
            return `${x1},${y1} ${x1 - ARROW_LINE_LENGTH},${y1 + ARROW_LINE_LENGTH} ${x1},${y1} ${x1 + ARROW_LINE_LENGTH},${y1 + ARROW_LINE_LENGTH} `
            break;
        case 'DOWN':
            return `${x1},${y1} ${x1 - ARROW_LINE_LENGTH},${y1 - ARROW_LINE_LENGTH} ${x1},${y1} ${x1 + ARROW_LINE_LENGTH},${y1 - ARROW_LINE_LENGTH} `
            break;
        case 'RIGHT':
            return `${x1},${y1} ${x1 - ARROW_LINE_LENGTH},${y1 - ARROW_LINE_LENGTH} ${x1},${y1} ${x1 - ARROW_LINE_LENGTH},${y1 + ARROW_LINE_LENGTH} `
            break;
        case 'LEFT':
            return `${x1},${y1} ${x1 + ARROW_LINE_LENGTH},${y1 - ARROW_LINE_LENGTH} ${x1},${y1} ${x1 + ARROW_LINE_LENGTH},${y1 + ARROW_LINE_LENGTH} `
            break;
        default:
            return `${x1},${y1} ${x1 - ARROW_LINE_LENGTH},${y1 - ARROW_LINE_LENGTH} ${x1},${y1} ${x1 - ARROW_LINE_LENGTH},${y1 + ARROW_LINE_LENGTH} `;
            break;
    }
}
function determinArrowPointsString(x, y, x1, y1) {
    if (x === x1 && y > y1) { // arrow pointing right
        return determinePointsbasedOnDirection(x, y, x1, y1, 'RIGHT') // UNEXPECTED
    } else if (x === x1 && y < y1) { // arrow pointing right
        return determinePointsbasedOnDirection(x, y, x1, y1, 'RIGHT')
    } else if (x === x1 && y === y1) { // arrow pointing right
        return determinePointsbasedOnDirection(x, y, x1, y1, 'RIGHT') // UNEXPECTED
    } else if (y === y1 && x > x1) {
        return determinePointsbasedOnDirection(x, y, x1, y1, 'DOWN') // UNEXPECTED
    } else if (y === y1 && x < x1) {
        return determinePointsbasedOnDirection(x, y, x1, y1, 'RIGHT')
    } else if (y === y1 && x === x1) {
        // Covered
    } else if (x > x1 && y > y1) { // LEFT or UP
        return determinePointsbasedOnDirection(x, y, x1, y1, 'LEFT')
    } else if (x > x1 && y < y1) { // LEFT or DOWN
        return determinePointsbasedOnDirection(x, y, x1, y1, 'LEFT')
    } else if (x > x1 && y === y1) {
        // Covered

    } else if (x < x1 && y > y1) { // RIGHT or UP
        return determinePointsbasedOnDirection(x, y, x1, y1, 'RIGHT')
    } else if (x < x1 && y < y1) { // RIGHT or DOWN
        return determinePointsbasedOnDirection(x, y, x1, y1, 'RIGHT')
    } else if (x < x1 && y === y1) {
        // Covered
    } else if (y > y1 && x > x1) {
        // Covered
    } else if (y > y1 && x < x1) {
        // Covered
    } else if (y > y1 && x === x1) {
        // Covered
    } else if (y < y1 && x > x1) {
        // Covered
    } else if (y < y1 && x < x1) {
        // Covered
    } else if (y < y1 && x === x1) {
        // Covered
    }

}
function ChartElement(props) {
    const WIDTH = 80;
    const HEIGHT = 20;
    const isLeftSide = (props.phi > Math.PI / 2) && (props.phi < 3 * Math.PI / 2);
    let x = props.x;
    let textOffset = 6;
    let textAlignment = css.right;
    if (isLeftSide) {
        x -= WIDTH;
        textOffset = -6;
        textAlignment = css.left;
    }
    if (!props.level) {
        textOffset = 0;
        textAlignment = css.middle;
    }
    let className = css.container;

    if (props.runAnimation) {
        className += ' ' + css.play_mode;
    }
    if (props.isSelected) {
        className += ' ' + css.selected;
    }
    const root = <circle className={className} style={props.runAnimation ?  { animationDelay: `${props.delay}ms` } : {}} cx={props.x} cy={props.y} r={`${BIG_CIRCLE_RADIUS}`} fill="none" stroke="black" />;
    let rect = <rect className={className} style={props.runAnimation ?  { animationDelay: `${props.delay}ms` } : {}}
        rx="3" ry="3"
        x={x} y={props.y - HEIGHT / 2}
        width={WIDTH} height={HEIGHT} fill="none" stroke="black" />;
    let rhombus = <polygon className={className} style={props.runAnimation ?  { animationDelay: `${props.delay}ms` } : {}} points={`${props.x},  ${props.y - RHOMBUS_HALF_DIAMETER}
     ${props.x + RHOMBUS_HALF_DIAMETER},  ${props.y} 
        ${props.x},${props.y + RHOMBUS_HALF_DIAMETER} 
        ${props.x - RHOMBUS_HALF_DIAMETER},${props.y}  
        ${props.x},  ${props.y - RHOMBUS_HALF_DIAMETER}`}
        fill="none" stroke="black"
    />
    const node = <circle cx={props.x} cy={props.y} r="3" className={className} style={props.runAnimation ?  { animationDelay: `${props.delay}ms` } : {}} />
    let { parent: { x: parentX, y: parentY } = {} } = props;
    let { x: currentX, y: currentY } = props;
    console.log("Parents X and Y ", parentX, parentY);
    console.log("Current X and Y ", currentX, currentY);
    let arrow = <polygon className={className} style={props.runAnimation ?  { animationDelay: `${props.delay}ms` } : {}}
        points={`${determinArrowPointsString(parentX, parentY, currentX, currentY)} `} />

    // let arrow =<>
    // <line className={""} x1={`${ props.x}`}  y1={`${props.y}`}
    // x2={`${props.x - ARROW_LINE_LENGTH}`}  y2={`${props.y - ARROW_LINE_LENGTH}`} stroke={'black'}  strokeWidth={2}/>
    // <line className={""} x1={`${ props.x}`}  y1={`${props.y}`}
    // x2={`${props.x - ARROW_LINE_LENGTH}`}  y2={`${props.y + ARROW_LINE_LENGTH}`} />
    // </>
    // let arrow = <><polygon points="2,7 0,0 11,7 0,14" transform="translate(100 100) rotate(45 0 0) translate(-2 -7)" stroke="red" fill="red" />
    //     <line x1="0" y1="0" x2="100" y2="100" stroke="green" /></>

    // let arrow = <polygon className={className} 
    //     points={`${props.x},${props.y} ${props.x - ARROW_LINE_LENGTH},${props.y - ARROW_LINE_LENGTH} ${props.x},${props.y} ${props.x - ARROW_LINE_LENGTH},${props.y + ARROW_LINE_LENGTH} `} />

    let element;
    switch (props.displayShape) {
        case SHAPES.BIG_CIRCLE:
            element = root;
            break;
        case SHAPES.RHOMBUS:
            //alert(props.x + " "+props.y)
            element = rhombus;
            break;
        case SHAPES.RECTANGLE:
            element = rect;
            break;
        case SHAPES.ARROW:
            element = arrow;
            break;
        default:
            element = node;
            break;
    }

    return (
        <>
            <g onClick={() => props.onClick(props.id)}>
                {element}
                <text className={css.text + ' ' + textAlignment}
                    x={props.x + textOffset} y={props.y}>{props.name}</text>
                {/* <polygon points={'50,0 21,90 98,35'} /> */}
            </g>
        </>
    );
}

export default ChartElement;
