import "../customBootstrap.scss";
import {InterfaceExpense} from "./Expense.type";
import "./ExpenseList.style.css"
import ExpenseModal from "./ExpenseModal";
import {useState} from "react";
import DeletePopUp from "./DeletePopUp.tsx";

type Props = {
    list: InterfaceExpense[];
    onDeleteClickHnd: (data: InterfaceExpense) => void;
    onEdit: (data: InterfaceExpense) => void;
    setList: (data: InterfaceExpense[])=>void;
};
const ExpenseList = (props: Props) => {
    const {list,onDeleteClickHnd,onEdit,setList} = props;
    const [showModal,setShowModal] = useState(false);
    const [dataToShow,setDataToShow] = useState(null as InterfaceExpense | null);
    const [nameSort,setNameSort]=useState(false);
    const [paidSort,setPaidSort]=useState(false);
    const [priceSort,setPriceSort]=useState(false);
    const [showDelete,setShowDelete]=useState(false);
    const [toDelete,setToDelete]= useState(null as InterfaceExpense|null);
    const sortName = () =>{
        if (!nameSort){
            const temp=list.sort((a,b)=>(a.name<b.name ? 1:-1));
            setList(temp);
            setNameSort(true);
            setPriceSort(false);
            setPaidSort(false);
        }else{
            const temp=list.sort((a,b)=>(a.name<b.name ? -1:1));
            setList(temp);
            setNameSort(false);
            setPriceSort(false);
            setPaidSort(false);
        }
    }
    const sortPaid = () =>{
        if (!paidSort){
            const temp=list.sort((a,b)=>(a.paid<b.paid ? 1:-1));
            setList(temp);
            setPaidSort(true);
            setNameSort(false);
            setPriceSort(false);
        }else{
            const temp=list.sort((a,b)=>(a.paid<b.paid ? -1:1));
            setList(temp);
            setPaidSort(false);
            setNameSort(false);
            setPriceSort(false);
        }
    }
    const sortPrice = () =>{
        if (!priceSort){
            const temp=list.sort((a,b)=>(a.price<b.price ? 1:-1));
            setList(temp);
            setPriceSort(true);
            setNameSort(false);
            setPaidSort(false);
        }else{
            const temp=list.sort((a,b)=>(a.price<b.price ? -1:1));
            setList(temp);
            setPriceSort(false);
            setNameSort(false);
            setPaidSort(false);
        }
    }
    const viewExpense = (data:InterfaceExpense) =>{
        setDataToShow(data);
        setShowModal(true);
    }
    // @ts-ignore
    return (<>
        <div>
            <h3>Expense list</h3>
        </div>
        <div>
            <table className="table table-bordered border-primary">
                <thead>
                <tr>
                    <th>Name <button type="button" className="btn btn-primary btn-sm" onClick={sortName}>{nameSort ? '▲': '▼'}</button></th>
                    <th>Paid by <button type="button" className="btn btn-primary btn-sm" onClick={sortPaid}>{paidSort ? '▲': '▼'}</button></th>
                    <th>Price <button type="button" className="btn btn-primary btn-sm" onClick={sortPrice}>{priceSort ? '▲': '▼'}</button></th>
                    <th>Currency</th>
                    <th className="actions">Actions</th>
                    <th className="export">Export</th>
                </tr>
                </thead>
                {list.map((expense) => {
                    return (
                        <tr key={expense.id}>
                            <td>{expense.name}</td>
                            <td>{expense.paid}</td>
                            <td>{expense.price}</td>
                            <td>{expense.currency}</td>
                            <td>
                                <div className="action-button-container">
                                    <input type="button" value="View" onClick={() => viewExpense(expense)}/>
                                    <input type="button" value="Edit" onClick={() => onEdit(expense)}/>
                                    <input type="button" value="Delete" onClick={()=>{
                                        setToDelete(expense);
                                        setShowDelete(true);
                                        // onDeleteClickHnd(expense)
                                    }}/>
                                </div>
                            </td>
                            <td>
                                <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                                    <input type="checkbox" className="btn-check" id={expense.id} autoComplete="off"/>
                                    <label className="btn btn-outline-primary" htmlFor={expense.id}>X</label>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </table>
            {showModal && dataToShow!==null && <ExpenseModal onClose={()=>setShowModal(false)} data={dataToShow}/>}
            {showDelete && toDelete!==null && <DeletePopUp onClose={()=>setShowDelete(false)} commit={()=>{onDeleteClickHnd(toDelete);setShowDelete(false)}}/>}
        </div>
        </>
    );

};

export default ExpenseList;
