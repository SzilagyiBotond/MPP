import {InterfaceExpense} from "./Expense.type";
import {useContext, useState} from "react";
import InvalidInputPopUp from "./InvalidInputPopUp.tsx";
import axios from "axios";
import {ExpenseContext} from "../ExpenseContext.tsx";
import ServerErrorPopUp from "./ServerErrorPopUp.tsx";
import {PersonContext} from "../PeopleContext.tsx";
import {Person} from "./Person.type.ts";

type Props = {
    data:Person;
    onBackBtnClickHnd: ()=> void;
}
const EditExpense = (props:Props) =>{
    const {expenses,setExpenses}=useContext(ExpenseContext);
    const {persons,setPersons}=useContext(PersonContext);
    const {data,onBackBtnClickHnd}=props;
    const [name,setName]=useState(data.name);
    const [status,setStatus]=useState(data.status);
    const [revolut,setRevolut]=useState(data.revolutId);
    const [showPopup,setShowPopup]=useState(false);
    const [serverError,setServerError]=useState(false);
    const [srvErrName,setSrvErrName]=useState("");
    const [srvErrMsg,setSrvErrMsg]=useState("");
    const onSubmitBtnClickHnd = async (e: any) => {
        e.preventDefault();
        if (name !== "" && status !== "" && revolut !== "") {
            const edited: Person = {
                id: data.id,
                name: name,
                status: status,
                revolutId: revolut,
            }
            await axios.put(`http://localhost:8080/persons/${edited.id}`, edited,{timeout: 1000})
                .then((response) => {
                    console.log(response.data);
                    localStorage.setItem('personsList', JSON.stringify(persons));
                    // onSubmitClickHnd(data);
                    onBackBtnClickHnd();
                })
                .catch( function (error) {
                    const err=error.toJSON();
                    setSrvErrMsg(err.message);
                    setSrvErrName(err.name);
                    setServerError(true);
                });
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
                    <label className="input-group-text">Status: </label>
                    <input className="form-control" type="text" value={status} onChange={(e) => setStatus(e.target.value)}/>
                </div>
                <div className="input-group mb-3">
                    <label className="input-group-text">revolut: </label>
                    <input className="form-control" type="text" value={revolut} onChange={(e) => setRevolut(e.target.value)}/>
                </div>
                <div>
                    <input type="button" value="Back" onClick={onBackBtnClickHnd}/>
                    {/*<Link to="/" type="button">Back</Link>*/}
                    <input type="submit" value="Edit persons"/>
                </div>
            </form>
            {showPopup && <InvalidInputPopUp onClose={() => setShowPopup(false)}/>}
            {serverError &&
                <ServerErrorPopUp message={srvErrMsg} name={srvErrName} onClose={() => setServerError(false)}/>}
        </div>
    </>
}
export default EditExpense;