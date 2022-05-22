import css from "./chartelement.module.css";
import { SHAPES } from "./Map";
const BIG_CIRCLE_RADIUS = 40;
const RHOMBUS_HALF_DIAMETER = 30;
const ARROW_LINE_LENGTH = 15;
// const PARALLEL_SIDE_LENGTH = 50;
// const PARALLEL_EXTENDED_LENGTH = 10;
function determinePointsbasedOnDirection(x, y, x1, y1, direction) {
  switch (direction) {
    case "UP":
      return `${x1},${y1} ${x1 - ARROW_LINE_LENGTH},${
        y1 + ARROW_LINE_LENGTH
      } ${x1},${y1} ${x1 + ARROW_LINE_LENGTH},${y1 + ARROW_LINE_LENGTH} `;
      break;
    case "DOWN":
      return `${x1},${y1} ${x1 - ARROW_LINE_LENGTH},${
        y1 - ARROW_LINE_LENGTH
      } ${x1},${y1} ${x1 + ARROW_LINE_LENGTH},${y1 - ARROW_LINE_LENGTH} `;
      break;
    case "RIGHT":
      return `${x1},${y1} ${x1 - ARROW_LINE_LENGTH},${
        y1 - ARROW_LINE_LENGTH
      } ${x1},${y1} ${x1 - ARROW_LINE_LENGTH},${y1 + ARROW_LINE_LENGTH} `;
      break;
    case "LEFT":
      return `${x1},${y1} ${x1 + ARROW_LINE_LENGTH},${
        y1 - ARROW_LINE_LENGTH
      } ${x1},${y1} ${x1 + ARROW_LINE_LENGTH},${y1 + ARROW_LINE_LENGTH} `;
      break;
    default:
      return `${x1},${y1} ${x1 - ARROW_LINE_LENGTH},${
        y1 - ARROW_LINE_LENGTH
      } ${x1},${y1} ${x1 - ARROW_LINE_LENGTH},${y1 + ARROW_LINE_LENGTH} `;
      break;
  }
}
function determinArrowPointsString(x, y, x1, y1) {
  if (x === x1 && y > y1) {
    // arrow pointing right
    return determinePointsbasedOnDirection(x, y, x1, y1, "RIGHT"); // UNEXPECTED
  } else if (x === x1 && y < y1) {
    // arrow pointing right
    return determinePointsbasedOnDirection(x, y, x1, y1, "RIGHT");
  } else if (x === x1 && y === y1) {
    // arrow pointing right
    return determinePointsbasedOnDirection(x, y, x1, y1, "RIGHT"); // UNEXPECTED
  } else if (y === y1 && x > x1) {
    return determinePointsbasedOnDirection(x, y, x1, y1, "DOWN"); // UNEXPECTED
  } else if (y === y1 && x < x1) {
    return determinePointsbasedOnDirection(x, y, x1, y1, "RIGHT");
  } else if (y === y1 && x === x1) {
    // Covered
  } else if (x > x1 && y > y1) {
    // LEFT or UP
    return determinePointsbasedOnDirection(x, y, x1, y1, "LEFT");
  } else if (x > x1 && y < y1) {
    // LEFT or DOWN
    return determinePointsbasedOnDirection(x, y, x1, y1, "LEFT");
  } else if (x > x1 && y === y1) {
    // Covered
  } else if (x < x1 && y > y1) {
    // RIGHT or UP
    return determinePointsbasedOnDirection(x, y, x1, y1, "RIGHT");
  } else if (x < x1 && y < y1) {
    // RIGHT or DOWN
    return determinePointsbasedOnDirection(x, y, x1, y1, "RIGHT");
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
  const isLeftSide = props.phi > Math.PI / 2 && props.phi < (3 * Math.PI) / 2;
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
    className += " " + css.play_mode;
  }
  if (props.isSelected) {
    className += " " + css.selected;
  }
  const root = (
    <circle
      style={
        props.runAnimation ? { "--animationDelay": `${props.delay}ms` } : {}
      }
      className={className}
      cx={props.x}
      cy={props.y}
      r={`${BIG_CIRCLE_RADIUS}`}
      fill="none"
      stroke="black"
    />
  );
  let rect = (
    <rect
      className={className}
      style={props.runAnimation ? { animationDelay: `${props.delay}ms` } : {}}
      rx="3"
      ry="3"
      x={x}
      y={props.y - HEIGHT / 2}
      width={WIDTH}
      height={HEIGHT}
      fill="none"
      stroke="black"
    />
  );
  let rhombus = (
    <polygon
      className={className}
      style={props.runAnimation ? { animationDelay: `${props.delay}ms` } : {}}
      points={`${props.x},  ${props.y - RHOMBUS_HALF_DIAMETER}
     ${props.x + RHOMBUS_HALF_DIAMETER},  ${props.y} 
        ${props.x},${props.y + RHOMBUS_HALF_DIAMETER} 
        ${props.x - RHOMBUS_HALF_DIAMETER},${props.y}  
        ${props.x},  ${props.y - RHOMBUS_HALF_DIAMETER}`}
      fill="none"
      stroke="black"
    />
  );
  const node = (
    <circle
      cx={props.x}
      cy={props.y}
      r="3"
      className={className}
      style={props.runAnimation ? { animationDelay: `${props.delay}ms` } : {}}
    />
  );
  let { parent: { x: parentX, y: parentY } = {} } = props;
  let { x: currentX, y: currentY } = props;
  // console.log("Parents X and Y ", parentX, parentY);
  // console.log("Current X and Y ", currentX, currentY);
  let arrow = (
    <polygon
      className={className}
      style={props.runAnimation ? { animationDelay: `${props.delay}ms` } : {}}
      points={`${determinArrowPointsString(
        parentX,
        parentY,
        currentX,
        currentY
      )} `}
      strokeWidth="3"
    />
  );

  let element;
  switch (props.displayShape) {
    case SHAPES.BIG_CIRCLE:
      element = root;
      break;
    case SHAPES.RHOMBUS:
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
  const determineStrings = (bigString) => {
    var result = [];
    while (bigString.length) {
      result.push(bigString.substr(0, 10));
      bigString = bigString.substr(10);
    }
    return result;
  };
  return (
    <>
      <g onClick={() => props.onClick(props.id)}>
        {element}
        {props.displayShape !== SHAPES.ARROW &&
          props.displayShape !== SHAPES.RHOMBUS && (
            <text
              className={css.text + " " + textAlignment}
              x={props.x + textOffset}
              y={props.y}
            >
              {props.name}
            </text>
          )}
        {props.displayShape === SHAPES.RHOMBUS && (
          <text
            className={css.text + " " + textAlignment}
            x={props.x - textOffset}
            y={props.y - textOffset}
          >
            {determineStrings(props.name).map((x, i) => {
              return (
                <tspan x={props.x - textOffset} dy={`1em`}>
                  {x}
                </tspan>
              );
            })}
          </text>
        )}
        {props.displayShape === SHAPES.ARROW && (
          <>
            {"Name :" + props.name} :{" "}
            {props.inputsList?.map((x, i) => {
              return (
                <>
                  {false && i === 0 && (
                    <text
                      className={css.text + " " + textAlignment}
                      x={props.x + textOffset}
                      y={props.y - i * 20}
                    >
                      {"Name : " +
                        props.name +
                        "    Inputs : " +
                        (x.key + " : " + x.value + " || ")}
                    </text>
                  )}
                  <text
                    className={css.text + " " + textAlignment}
                    x={props.x + textOffset}
                    y={props.y + i * 10}
                  >
                    {x.key + " : " + x.value + " || "}
                  </text>
                </>
              );
            })}
          </>
        )}
      </g>
      {/* foreignObject not working */}
    </>
  );
}

export default ChartElement;
