import {useContext, useState} from "react";
import {InterfaceExpense} from "./Expense.type";
import InvalidInputPopUp from "./InvalidInputPopUp.tsx";
import axios from "axios";
import {ExpenseContext} from "../ExpenseContext.tsx";
import ServerErrorPopUp from "./ServerErrorPopUp.tsx";
import {PersonContext} from "../PeopleContext.tsx";

type Props = {
    onBackBtnClickHnd : () => void;
}
const AddExpense = (props: Props) => {
    const {expenses,setExpenses}=useContext(ExpenseContext);
    const {persons,setPersons}=useContext(PersonContext);
    const {onBackBtnClickHnd} = props;
    const [name,setName]=useState("");
    const [price,setPrice]=useState(0);
    const [paid,setPaid]=useState("");
    const [description,setDescription]=useState("");
    const [date,setDate]=useState("");
    const [currency,setCurrency]=useState("LEI");
    const [showPopup,setShowPopup]=useState(false);
    const [serverError,setServerError]=useState(false);
    const [srvErrName,setSrvErrName]=useState("");
    const [srvErrMsg,setSrvErrMsg]=useState("");
    const onSubmitBtnClickHnd = async (e: any) => {
        e.preventDefault();
        if (name !== "" && paid !== "" && date !== "") {
            const paid_field=persons.find(i=>i.name===paid);
            if (paid_field===null){
                setShowPopup(true);
            }else{
            const data: InterfaceExpense = {
                name: name,
                price: price,
                paid: paid_field,
                description: description,
                date: new Date(date),
                currency: currency
            }
            await axios.post("http://localhost:8080/expenses", data,{timeout: 1000})
                .then((response) => {
                    console.log(response.data);
                    localStorage.setItem('list', JSON.stringify(expenses));
                    // onSubmitClickHnd(data);
                    onBackBtnClickHnd();
                })
                .catch( function (error) {
                const err=error.toJSON();
                setSrvErrMsg(err.message);
                setSrvErrName(err.name);
                setServerError(true);
            });
            }
        } else {
            setShowPopup(true);
            return;
        }
    }
    return <>
        <div>
        <form onSubmit={onSubmitBtnClickHnd}>
            <div className="input-group mb-3">
                <label className="input-group-text">Name: </label>
                <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className="input-group mb-3">
                <label className="input-group-text">Paid by: </label>
                <input className="form-control" type="text" value={paid} onChange={(e) => setPaid(e.target.value)}/>
            </div>
            <div className="input-group mb-3">
                <label className="input-group-text">Price: </label>
                <input className="form-control" type="number" value={price} onChange={(e)=>setPrice(+e.target.value)}/>
            </div>
            <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="inputGroupSelect01">Currency: </label>
                <select className="form-select"  id="inputGroupSelect01" value={currency} onChange={event => setCurrency(event.target.value)}>
                    <option selected>Choose...</option>
                    <option value="LEI">LEI</option>
                    <option value="EUR">EUR</option>
                </select>
            </div>
            <div className="input-group mb-3">
                <label className="input-group-text">Description: </label>
                <input className="form-control" type="text" value={description} onChange={event => setDescription(event.target.value)}/>
            </div>
            <div className="input-group mb-3">
                <label className="input-group-text">Date: </label>
                <input className="form-control" type="date" value={date} onChange={event => setDate(event.target.value)}/>
            </div>
            <div>
                <input type="button" value="Back" onClick={onBackBtnClickHnd}/>
                <input type="submit" value="Add expense" />
            </div>
        </form>
        {showPopup && <InvalidInputPopUp onClose={()=>setShowPopup(false)}/>}
            {serverError && <ServerErrorPopUp message={srvErrMsg} name={srvErrName} onClose={()=>setServerError(false)}/>}
        </div>
    </>
}
export default AddExpense;