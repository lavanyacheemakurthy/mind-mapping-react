import css from './header.module.css';
import IconButton from './IconButton';
import logo from '../utilities/images/logo.jpg'
function Header(props) {
    return (
        <div className={css.container} >
            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#0099ff" fill-opacity="1" d="M0,96L34.3,101.3C68.6,107,137,117,206,133.3C274.3,149,343,171,411,181.3C480,192,549,192,617,181.3C685.7,171,754,149,823,154.7C891.4,160,960,192,1029,176C1097.1,160,1166,96,1234,90.7C1302.9,85,1371,139,1406,165.3L1440,192L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"></path>
            </svg> */}
            {/* <svg  id="svg" viewBox="0 0 1440 400" xmlns="http://www.w3.org/2000/svg" class="transition duration-300 ease-in-out delay-150"><defs><linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%"><stop offset="5%" stop-color="#002bdcff"></stop><stop offset="95%" stop-color="#32ded4ff"></stop></linearGradient></defs><path d="M 0,400 C 0,400 0,200 0,200 C 90.41025641025641,222.72051282051282 180.82051282051282,245.44102564102565 252,238 C 323.1794871794872,230.55897435897435 375.1282051282051,192.95641025641027 455,198 C 534.8717948717949,203.04358974358973 642.6666666666669,250.73333333333332 738,242 C 833.3333333333331,233.26666666666668 916.2051282051282,168.1102564102564 985,156 C 1053.7948717948718,143.8897435897436 1108.5128205128206,184.82564102564103 1182,201 C 1255.4871794871794,217.17435897435897 1347.7435897435898,208.58717948717947 1440,200 C 1440,200 1440,400 1440,400 Z" stroke="none" stroke-width="0" fill="url(#gradient)" class="transition-all duration-300 ease-in-out delay-150 path-0" transform="rotate(-180 720 200)"></path></svg> */}
            <IconButton name="menu" onClick={() => props.onMenuClick()} />
            <div className={css.title}><img src={logo} width={'100px'}/></div>
        </div>);
}

export default Header;
