type Props={
    onClose: () =>void;
    commit: () => void;
}
const DeletPopUp = (props:Props) => {
    const {onClose,commit} = props;
    // @ts-ignore
    return <div className="modal" tabIndex="-1">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Invalid input</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to delete?</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>Close
                    </button>
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={commit}>Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
}
export default DeletPopUp;