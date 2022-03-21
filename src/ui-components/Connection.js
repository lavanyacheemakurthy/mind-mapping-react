import css from "./connection.module.css";

function Connection(props) {
    const determineClassName = (element) => {

        switch (element.condition) {
            case "TRUE":
                return css.connection_condition_true;
            case "FALSE":
                return css.connection_condition_false;
            default:
                return css.connection
        }
    }
    const getElement = (element) => {
        if (element.level === 0) {
            return null;
        }
        const DX = element.isLeftSide ? -40 : 40;
        const dx = element.x - element.px;
        const dy = element.y - element.py;
        const d = `M ${element.px} ${element.py} c ${DX} 0, ${dx - DX} ${dy}, ${dx} ${dy}`;

        return (
            <path key={element.id} d={d} className={determineClassName(element)} />
        );
    };
    return (
        props.list.map(element => getElement(element))
    );
}

export default Connection;
