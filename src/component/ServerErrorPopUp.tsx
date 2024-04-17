type Props={
    message: string;
    name: string;
    onClose: ()=>void;
}
const ServerErrorPopUp = (props:Props) => {
    const {message,name,onClose} = props;
    // @ts-ignore
    return <div className="modal" tabIndex="-1">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Server error</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                </div>
                <div className="modal-body">
                    <p>{name}</p>
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    </div>
}

export default ServerErrorPopUp;