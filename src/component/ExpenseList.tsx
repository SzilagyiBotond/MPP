import "../customBootstrap.scss";
import {InterfaceExpense} from "./Expense.type";
import "./ExpenseList.style.css"
import ExpenseModal from "./ExpenseModal";
import {useContext,  useState} from "react";
import DeletePopUp from "./DeletePopUp.tsx";
import ExportPopUp from "./ExportPopUp.tsx";
import StackedDeletePopUp from "./StackedDeletePopUp.tsx";
import {ExpenseContext} from "../ExpenseContext.tsx";
import axios from "axios";
import ServerErrorPopUp from "./ServerErrorPopUp.tsx";
declare global {
    interface Navigator {
        msSaveBlob?: (blob: any, defaultName?: string) => boolean
    }
}
type Props = {
    onDeleteClickHnd: (data: InterfaceExpense) => void;
    onEdit: (data: InterfaceExpense) => void;
};
const ExpenseList = (props: Props) => {
    const {expenses,setExpenses}=useContext(ExpenseContext);
    const {onDeleteClickHnd,onEdit} = props;
    const [showModal,setShowModal] = useState(false);
    const [dataToShow,setDataToShow] = useState(null as InterfaceExpense | null);
    const [nameSort,setNameSort]=useState(false);
    const [paidSort,setPaidSort]=useState(false);
    const [priceSort,setPriceSort]=useState(false);
    const [showDelete,setShowDelete]=useState(false);
    const [toDelete,setToDelete]= useState(null as InterfaceExpense|null);
    const [toExport,setToExport]=useState([] as InterfaceExpense[]);
    const [errorExport,setErrorExport]=useState(false);
    const [toDeleteList,setToDeleteList]=useState([] as InterfaceExpense[]);
    const [errorDelete,setErrorDelete]=useState(false);
    const [serverError,setServerError]=useState(false);
    const [srvErrName,setSrvErrName]=useState("");
    const [srvErrMsg,setSrvErrMsg]=useState("");
    const toCSV = (data:InterfaceExpense[]) =>{
        const header=Object.keys(data[0]);
        const csvContent=[
            header.join(','),
            ...data.map(obj=>header.map(key=>obj[key]).join(','))
        ].join('\n');
        return csvContent;
    }
    const saveToCsv = (toExport : InterfaceExpense[])=>{
        if (toExport.length===0){
            setErrorExport(true);
            return;
        }
        const csv=toCSV(toExport);
        const exportedFileName="exported.csv";
        const blob=new Blob([csv],{type: 'text/csv;charset=utf-8;'});
        if (navigator.msSaveBlob){
            navigator.msSaveBlob(blob, exportedFileName);
        }else{
            const link = document.createElement("a");
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
    const deleteList = async (data: InterfaceExpense[]) => {
        if (data.length === 0) {
            setErrorDelete(true);
            return;
        }
        // const temp = [...expenses];
        for (const expense of data) {
            await axios.delete(`http://localhost:8080/expenses/${expense.id}`,{timeout: 1000}).then(response => console.log(response.data)).catch( function (error) {
                const err=error.toJSON();
                setSrvErrMsg(err.message);
                setSrvErrName(err.name);
                setServerError(true);
            });
            // const index = temp.indexOf(expense);
            // if (index !== -1) {
            //     temp.splice(index, 1);
            // }
            await axios.get(`http://localhost:8080/expenses`,{timeout: 1000}).then(response=>setExpenses(response.data)).catch( function (error) {
                const err=error.toJSON();
                setSrvErrMsg(err.message);
                setSrvErrName(err.name);
                setServerError(true);
            });
        }
        // setExpenses(temp);
        setToDeleteList([]);
        localStorage.setItem('list', JSON.stringify(expenses));
    }
    const commitDelete = (data:InterfaceExpense)=>{
        deleteFromExport(data);
        deleteFromDelete(data);
        onDeleteClickHnd(data);
        setShowDelete(false);
    }
    const deleteFromExport = (data:InterfaceExpense)=>{
        const indexToDelete=toExport.indexOf(data);
        if (indexToDelete!==-1) {
            const tempList = [...toExport];
            tempList.splice(indexToDelete, 1);
            setToExport(tempList);
        }
    }
    const deleteFromDelete = (data:InterfaceExpense)=>{
        const indexToDelete=toDeleteList.indexOf(data);
        if (indexToDelete!==-1) {
            const tempList = [...toDeleteList];
            tempList.splice(indexToDelete, 1);
            setToDeleteList(tempList);
        }
    }
    const setExportState = (data:InterfaceExpense)=>{
        const indexExport=toExport.indexOf(data);
        if (indexExport!==-1){
            const tempList=[...toExport];
            tempList.splice(indexExport,1);
            setToExport(tempList);
        }else{
            setToExport([...toExport,data]);
        }
    }
    const setDeleteState = (data:InterfaceExpense)=>{
        const indexExport=toDeleteList.indexOf(data);
        if (indexExport!==-1){
            const tempList=[...toDeleteList];
            tempList.splice(indexExport,1);
            setToDeleteList(tempList);
        }else{
            setToDeleteList([...toDeleteList,data]);
        }
    }
    const sortName = async () => {
        if (!nameSort) {
            //const temp=expenses.sort((a,b)=>(a.name<b.name ? 1:-1));
            await axios.get(`http://localhost:8080/expenses?field=name`, {timeout: 1000}).then(response => setExpenses(response.data)).catch(function (error) {
                const err = error.toJSON();
                setSrvErrMsg(err.message);
                setSrvErrName(err.name);
                setServerError(true);
            });
            //setExpenses(temp);
            setNameSort(true);
            setPriceSort(false);
            setPaidSort(false);
        } else {
            //const temp = expenses.sort((a, b) => (a.name < b.name ? -1 : 1));
            //setExpenses(temp);
            await axios.get(`http://localhost:8080/expenses?field=name&order=desc`, {timeout: 1000}).then(response => setExpenses(response.data)).catch(function (error) {
                const err = error.toJSON();
                setSrvErrMsg(err.message);
                setSrvErrName(err.name);
                setServerError(true);
            });
            setNameSort(false);
            setPriceSort(false);
            setPaidSort(false);
        }
    }
    const sortPaid = () =>{
        if (!paidSort){
            const temp=expenses.sort((a,b)=>(a.paid.name<b.paid.name ? 1:-1));
            setExpenses(temp);
            setPaidSort(true);
            setNameSort(false);
            setPriceSort(false);
        }else{
            const temp=expenses.sort((a,b)=>(a.paid.name<b.paid.name ? -1:1));
            setExpenses(temp);
            setPaidSort(false);
            setNameSort(false);
            setPriceSort(false);
        }
    }
    const sortPrice = async () => {
        if (!priceSort) {
            //const temp=expenses.sort((a,b)=>(a.price<b.price ? 1:-1));
            //setExpenses(temp);
            await axios.get(`http://localhost:8080/expenses?field=price`, {timeout: 1000}).then(response => setExpenses(response.data)).catch(function (error) {
                const err = error.toJSON();
                setSrvErrMsg(err.message);
                setSrvErrName(err.name);
                setServerError(true);
            });
            setPriceSort(true);
            setNameSort(false);
            setPaidSort(false);
        } else {
            //const temp = expenses.sort((a, b) => (a.price < b.price ? -1 : 1));
            //setExpenses(temp);
            await axios.get(`http://localhost:8080/expenses?field=price&order=desc`, {timeout: 1000}).then(response => setExpenses(response.data)).catch(function (error) {
                const err = error.toJSON();
                setSrvErrMsg(err.message);
                setSrvErrName(err.name);
                setServerError(true);
            });
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
            <input type="button" value="Export" className="add-button" onClick={() => saveToCsv(toExport)}/>
            <input type="button" value="Delete" className="add-button" onClick={() => deleteList(toDeleteList)}/>
            <div>
                <h3>Expense list</h3>
            </div>
            <div>
                <table className="table table-bordered border-primary">
                    <thead>
                    <tr>
                        <th>Name <button type="button" className="btn btn-primary btn-sm"
                                         onClick={sortName}>{nameSort ? '▲' : '▼'}</button></th>
                        <th>Paid by <button type="button" className="btn btn-primary btn-sm"
                                            onClick={sortPaid}>{paidSort ? '▲' : '▼'}</button></th>
                        <th>Price <button type="button" className="btn btn-primary btn-sm"
                                          onClick={sortPrice}>{priceSort ? '▲' : '▼'}</button></th>
                        <th>Currency</th>
                        <th className="actions">Actions</th>
                        <th className="export">Export</th>
                        <th className="export">Delete</th>
                    </tr>
                    </thead>
                    {expenses.map((expense) => {
                        return (
                            <tr key={expense.id}>
                                <td>{expense.name}</td>
                                <td>{expense.paid.name}</td>
                                <td>{expense.price}</td>
                                <td>{expense.currency}</td>
                                <td>
                                    <div className="action-button-container">
                                        <input type="button" value="View" onClick={() => viewExpense(expense)}/>
                                        <input type="button" value="Edit" onClick={() => onEdit(expense)}/>
                                        <input type="button" value="Delete" onClick={() => {
                                            setToDelete(expense);
                                            setShowDelete(true);
                                            // onDeleteClickHnd(expense)
                                        }}/>
                                    </div>
                                </td>
                                <td>
                                    <div className="btn-group" role="group"
                                         aria-label="Basic checkbox toggle button group">
                                        <input type="checkbox" className="btn-check" id={expense.id}
                                               onClick={() => setExportState(expense)} autoComplete="off"/>
                                        <label className="btn btn-outline-primary" htmlFor={expense.id}>X</label>
                                    </div>
                                </td>
                                <td>
                                    <div className="btn-group" role="group"
                                         aria-label="Basic checkbox toggle button group">
                                        <input type="checkbox" className="btn-check" id={expense.id+"d"}
                                               onClick={() => setDeleteState(expense)} autoComplete="off"/>
                                        <label className="btn btn-outline-primary" htmlFor={expense.id+"d"}>X</label>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </table>
                {showModal && dataToShow !== null &&
                    <ExpenseModal onClose={() => setShowModal(false)} data={dataToShow}/>}
                {showDelete && toDelete !== null && <DeletePopUp onClose={() => setShowDelete(false)} commit={() => {
                    commitDelete(toDelete)
                }}/>}
                {errorExport && <ExportPopUp onClose={() => setErrorExport(false)}/>}
                {errorDelete && <StackedDeletePopUp onClose={() => setErrorDelete(false)}/>}
                {serverError && <ServerErrorPopUp message={srvErrMsg} name={srvErrName} onClose={()=>setServerError(false)}/>}
            </div>
        </>
    );

};

export default ExpenseList;
