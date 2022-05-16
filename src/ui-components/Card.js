import css from "./card.module.css";
import { Player, Controls } from '@lottiefiles/react-lottie-player';
function Card(props) {
    let className = css.container;
    if (props.isSelected) {
        className += ' ' + css.selected;
    }
    return (
        <div className={className}
            onClick={props.onClick}>
            <Player
                autoplay
                loop
                src="https://assets3.lottiefiles.com/packages/lf20_zdo3l6my.json"
                style={{ height: '100px', width: '300px' }}
            >
                <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
            </Player>
            <div className={css.title}>{props.name}</div>
            <div className={css.comment}>{props.comment}</div>
        </div>
    );
}

export default Card;
