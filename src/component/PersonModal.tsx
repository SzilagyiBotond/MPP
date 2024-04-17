import {Person} from "./Person.type.ts";

type Props = {
    onClose: () => void;
    data: Person;
}
const PersonModal =(props: Props) => {
    const {onClose,data} = props;
    return (<div className="modal" tabIndex="-1">
    <div className="modal-dialog">
    <div className="modal-content">
    <div className="modal-header">
    <h5 className="modal-title">{data.name}</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
        <p>Status: {data.status}</p>
            <p>Revolut: {data.revolutId}</p>
    </div>
    <div className="modal-footer">
    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onClose}>Close</button>
        </div>
        </div>
        </div>
        </div>)
}

export default PersonModal;