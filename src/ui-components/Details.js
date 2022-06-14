import { Form } from "react-bootstrap";
import css from "./details.module.css";
import Inputs from "./Inputs";
import { SHAPES } from "./Map";

function Details(props) {
  let isTableView = props.view === "table";
  return (
    <div className={css.container}>
      <h2>Details ID{props.id}</h2>
      {isTableView && (
        <lable style={{ fontSize: "12px", fontStyle: "italics", color: "red" }}>
          {" "}
          * Switch to pictorial view to make changes in details
        </lable>
      )}
      <form>
        <fieldset>
          <label>ID</label>
          <input className={css.input} value={props.id} disabled type="text" />
        </fieldset>
        <fieldset>
          <label>Level</label>
          <input
            className={css.input}
            value={props.level}
            disabled
            type="text"
          />
        </fieldset>
        <fieldset>
          <label>Name</label>
          <input
            // disabled={isTableView}
            className={css.input}
            onChange={props.onChangeName}
            value={props.name}
            type="text"
          />
        </fieldset>

        {props.condition && (
          <fieldset>
            <label>Condition</label>
            <input
              className={css.input}
              value={props.condition}
              disabled
              type="text"
            />
          </fieldset>
        )}
        <fieldset>
          <label for="shape">Choose a shape:</label>
          <Form.Select
            aria-label="select shape"
            id="shape"
            onChange={props.onChangeShape}
            disabled={isTableView}
            type="shape"
            value={props.displayShape}
          >
            {Object.keys(SHAPES).map((x) => {
              if (props.level === 0 && x === SHAPES.ARROW) {
                return;
              }
              return <option value={x}>{SHAPES[x]}</option>;
            })}
          </Form.Select>

          {props.displayShape === SHAPES.RHOMBUS && (
            <div>
              <input
                disabled={isTableView}
                type="button"
                name="Invert YES and NO flows"
                value="Invert YES and NO flows"
                onClick={props.invertConditionalFlows}
              />
            </div>
          )}
        </fieldset>
        {props.displayShape === SHAPES.ARROW && (
          <fieldset>
            <label for="shape">Select Inputs</label>
            <Inputs
              view={props.view}
              className={css.inputs_div}
              data={props.inputsList ? [...props.inputsList] : []}
              displayShape={props.displayShape}
              updateInputs={props.updateInputs}
              updateInputsValues={props.updateInputsValues}
              // data={[{key:'name',value:'lavanya'},{key:'name',value:'lavanya'}]}
            />
          </fieldset>
        )}
        <fieldset>
          <label>Comments</label>
          <textarea
            rows="5"
            onChange={props.onChangeComment}
            value={props.comment}
            className={css.textarea}
            disabled={isTableView}
          ></textarea>
        </fieldset>
      </form>
    </div>
  );
}

export default Details;
