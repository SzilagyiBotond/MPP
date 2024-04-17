import {InterfaceExpense} from "./Expense.type";
import {useContext, useState} from "react";
import InvalidInputPopUp from "./InvalidInputPopUp.tsx";
import axios from "axios";
import {ExpenseContext} from "../ExpenseContext.tsx";
import ServerErrorPopUp from "./ServerErrorPopUp.tsx";
import {PersonContext} from "../PeopleContext.tsx";

type Props = {
    data:InterfaceExpense;
    onBackBtnClickHnd: ()=> void;
}
const EditExpense = (props:Props) =>{
    const {expenses,setExpenses}=useContext(ExpenseContext);
    const {persons,setPersons}=useContext(PersonContext);
    const {data,onBackBtnClickHnd}=props;
    const [name,setName]=useState(data.name);
    const [price,setPrice]=useState(data.price);
    const [paid,setPaid]=useState(data.paid.name);
    const [description,setDescription]=useState(data.description);
    const [date,setDate]=useState("");
    const [currency,setCurrency]=useState(data.currency);
    const [showPopup,setShowPopup]=useState(false);
    const [serverError,setServerError]=useState(false);
    const [srvErrName,setSrvErrName]=useState("");
    const [srvErrMsg,setSrvErrMsg]=useState("");
    const onSubmitBtnClickHnd = async (e: any) => {
        e.preventDefault();
        if (name !== "" && date !== "") {
            const paid_field=persons.find(i=>i.name===paid);
            console.log(paid_field);
            if (paid_field===undefined){
                setShowPopup(true);
                return;
            }else {
                const edited: InterfaceExpense = {
                    id: data.id,
                    name: name,
                    price: price,
                    paid: paid_field,
                    description: description,
                    date: new Date(date),
                    currency: currency
                }

                await axios.put(`http://localhost:8080/expenses/${data.id}`, edited, {timeout: 1000})
                    .then((response) => {
                        console.log(response.data);
                        localStorage.setItem('list', JSON.stringify(expenses));
                        // onSubmitClickHnd(data);
                        onBackBtnClickHnd();
                    })
                    .catch(function (error) {
                        const err = error.toJSON();
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
                <select className="form-select"  id="inputGroupSelect01" value={currency} onChange={event => setCurrency(event.target.value.toString)}>
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
                {/*<Link to="/" type="button">Back</Link>*/}
                <input type="submit" value="Edit expense" />
            </div>
        </form>
        {showPopup && <InvalidInputPopUp onClose={()=>setShowPopup(false)}/>}
            {serverError && <ServerErrorPopUp message={srvErrMsg} name={srvErrName} onClose={()=>setServerError(false)}/>}
            </div>
    </>
}
export default EditExpense;