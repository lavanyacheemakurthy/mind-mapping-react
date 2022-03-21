import css from "./details.module.css";
import { SHAPES } from "./Map";

function Details(props) {
    return (
        <div className={css.container}>
            <h2>Details ID{props.id}</h2>
            <form>
                <fieldset>
                    <label>ID</label>
                    <input className={css.input} value={props.id} disabled type="text" />
                </fieldset>
                <fieldset>
                    <label>Level</label>
                    <input className={css.input} value={props.level} disabled type="text" />
                </fieldset>
                <fieldset>
                    <label>Name</label>
                    <input className={css.input}
                        onChange={props.onChangeName}
                        value={props.name} type="text" />
                </fieldset>
                <fieldset>
                    <label>Comment</label>
                    <textarea rows="10"
                        onChange={props.onChangeComment}
                        value={props.comment} className={css.textarea}></textarea>
                </fieldset>
                {props.condition && <fieldset>
                    <label>Condition</label>
                    <input className={css.input} value={props.condition} disabled type="text" />
                </fieldset>
                }
                <fieldset>
                    <label for="shape">Choose a shape:</label>
                    <select name="shape" id="shape" onChange={props.onChangeShape} type="shape" value={props.displayShape}>
                        {Object.keys(SHAPES).map(x => {
                            if (props.level === 0 && x === SHAPES.ARROW) {
                                return;
                            }
                            return (<option value={x}>{SHAPES[x]}</option>)
                        })}
                    </select>
                    {props.displayShape === SHAPES.RHOMBUS && <div>
                        <input type='button' name='Invert YES and NO flows' value='Invert YES and NO flows' onClick={props.invertConditionalFlows}/>
                    </div>}
                </fieldset>
            </form>
        </div>
    );
}

export default Details;