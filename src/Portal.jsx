import ReactDOM from 'react-dom';

export default function Portal(props) {
    const modalRoot = document.getElementById('portal');
    return ReactDOM.createPortal(props.children, modalRoot);
}