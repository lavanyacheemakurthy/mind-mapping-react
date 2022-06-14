import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IconButton from "./IconButton";
import css from "./toolbar.module.css";

function Toolbar(props) {
  let className = css.container;
  props.location.forEach((item) => {
    className += " " + css[item];
  });
  return (
    <div className={className}>
      {props.list.map((item) => (
        <div className={css.button} key={item.name}>
          <OverlayTrigger
            overlay={<Tooltip id="tooltip">{item.description? item.description:item.name}</Tooltip>}
          >
            <span className="d-inline-block">
              <IconButton
                name={item.name}
                onClick={item.onClick}
                type={props.type}
              />
            </span>
          </OverlayTrigger>
        </div>
      ))}
    </div>
  );
}

export default Toolbar;
