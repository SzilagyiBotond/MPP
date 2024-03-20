import {useState} from "react";
import {InterfaceExpense} from "./Expense.type";
import InvalidInputPopUp from "./InvalidInputPopUp.tsx";

type Props = {
    onBackBtnClickHnd : () => void;
    onSubmitClickHnd : (data: InterfaceExpense) => void;
}
const AddExpense = (props: Props) => {
    const {onBackBtnClickHnd, onSubmitClickHnd} = props;
    const [name,setName]=useState("");
    const [price,setPrice]=useState(0);
    const [paid,setPaid]=useState("");
    const [description,setDescription]=useState("");
    const [date,setDate]=useState("");
    const [currency,setCurrency]=useState("LEI");
    const [showPopup,setShowPopup]=useState(false);
    const onSubmitBtnClickHnd = (e:any) =>{
        e.preventDefault();
        if  (name!=="" && paid!=="" && date!==""){
            const data: InterfaceExpense ={
                id: Math.random().toString().slice(2),
                name: name,
                price: price,
                paid: paid,
                description: description,
                date: new Date(date),
                currency: currency
            }
            onSubmitClickHnd(data);
            onBackBtnClickHnd();
        }else{
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
        </div>
    </>
}
export default AddExpense;