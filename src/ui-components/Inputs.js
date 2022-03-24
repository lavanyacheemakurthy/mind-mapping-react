import { MinusSquare, PlusSquare } from "../utilities/Common/Common";
import css from "./card.module.css";

function Inputs(props) {

    return (
        <div className={props.className}>
            {props.data?.map((current, index) => {
                return <div key={current.inputId}>
                    {index === 0 && <div style={{ display: 'flex', flexDirection: 'row', fontWeight: '800' }}>
                        <div style={{ width: '30%' }}>{'Field'}</div>
                        <div style={{ width: '30%' }}> {'Value'}</div>
                    </div>}
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ width: '30%' }}>
                            <div>
                                {index === (props.data.length - 1) ? <input style={{ width: '60%' }} value={current.key}
                                    onChange={(e) => props.updateInputsValues(e, "key", index)} /> : current.key}</div>

                        </div>
                        <div style={{ width: '30%' }}>
                            <div>
                                {index === (props.data.length - 1) ? <input style={{ width: '60%' }} value={current.value}
                                    onChange={(e) => props.updateInputsValues(e, "value", index)} /> : current.value}</div>
                        </div>
                        {/* {
                            (index !== props.data.length - 1) && <div
                                style={{ marginTop: '-5px', cursor: 'pointer' }} onClick={() => {
                                    props.updateInputs({ pointer: index, op: 'ADD' })
                                }}>
                                <PlusSquare />
                            </div>
                        }
                        {
                            (index === (props.data.length - 1)) &&
                            <div style={{ marginTop: '-5px', cursor: 'pointer' }} onClick={() => {
                                props.updateInputs({ pointer: index, op: 'REMOVE' })
                            }}  >
                                <MinusSquare />
                            </div>
                        } */}
                        {
                            <div style={{ display: 'flex' }}>
                                {(index === props.data.length - 1) && <div style={{ paddingRight: '5px' }} onClick={() => {
                                    props.updateInputs({ pointer: index, op: 'ADD' })
                                }}><PlusSquare /></div>}
                                {<div onClick={() => {
                                    props.updateInputs({ pointer: index, op: 'REMOVE' })
                                }}><MinusSquare /></div>}
                            </div>
                        }
                    </div>
                </div>
            })}
            {(!props.data || props.data.length == 0) && <div style={{ cursor: 'pointer' }} onClick={() => {
                props.updateInputs({ pointer: -1, op: 'ADD' })
            }}>
                <PlusSquare />
            </div>}
        </div>
    );
}

export default Inputs;
