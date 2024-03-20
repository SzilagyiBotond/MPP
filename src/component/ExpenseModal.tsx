import {InterfaceExpense} from "./Expense.type";

type Props = {
    onClose: () => void;
    data: InterfaceExpense;
}
const ExpenseModal =(props: Props) => {
    const {onClose,data} = props;
    // @ts-ignore
    return (<div className="modal" tabIndex="-1">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{data.name}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                </div>
                <div className="modal-body">
                    <p>Price : {data.price.toString()}</p>
                    <p>Currency : {data.currency}</p>
                    <p>Paid by : {data.paid}</p>
                    <p>Description : {data.description}</p>
                    <p>Data : {data.date.toString()}</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    </div>)
}

export default ExpenseModal;