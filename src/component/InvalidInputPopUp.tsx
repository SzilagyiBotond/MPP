type Props={
    onClose: () =>void;
}
const InvalidInputPopUp = (props:Props) => {
    const {onClose} = props;
    // @ts-ignore
    return <div className="modal" tabIndex="-1">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Invalid input</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                </div>
                <div className="modal-body">
                    <p>You have made a mistake in completing the input fields.</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    </div>
}

export default InvalidInputPopUp;