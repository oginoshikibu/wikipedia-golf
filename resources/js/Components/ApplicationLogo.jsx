export default function ApplicationLogo(props) {
    return (
        <a href={route('welcome')}>
            <img src="img/sport010.svg" {...props}/>
        </a>
    );
}
