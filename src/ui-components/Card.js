import css from "./card.module.css";
// import { Player, Controls } from '@lottiefiles/react-lottie-player';
function Card(props) {
    let className = css.container;
    if (props.isSelected) {
        className += ' ' + css.selected;
    }
    return (
        <div className={className}
            onClick={props.onClick}>
                <img src={`https://source.unsplash.com/random/300x100?sig=${Math.random() * 1000}`} />
           
            <div className={css.title}>{props.name}</div>
            <div className={css.comment}>{props.comment}</div>
        </div>
    );
}

export default Card;
