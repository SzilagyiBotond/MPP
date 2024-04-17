import {useContext, useState} from "react";
import {InterfaceExpense} from "./Expense.type";
import InvalidInputPopUp from "./InvalidInputPopUp.tsx";
import axios from "axios";
import {ExpenseContext} from "../ExpenseContext.tsx";
import ServerErrorPopUp from "./ServerErrorPopUp.tsx";
import {PersonContext} from "../PeopleContext.tsx";
import {Person} from "./Person.type.ts";

type Props = {
    onBackBtnClickHnd : () => void;
}
const AddPerson = (props: Props) => {
    const {persons,setPersons}=useContext(PersonContext);
    const {onBackBtnClickHnd} = props;
    const [name,setName]=useState("");
    const [status,setStatus]=useState("");
    const [revolutId,setRevolutId]=useState("");
    const [showPopup,setShowPopup]=useState(false);
    const [serverError,setServerError]=useState(false);
    const [srvErrName,setSrvErrName]=useState("");
    const [srvErrMsg,setSrvErrMsg]=useState("");
    const onSubmitBtnClickHnd = async (e: any) => {
        e.preventDefault();
        if (name !== "" && status !== "" && revolutId !== "") {
            const data: Person = {
                name: name,
                status: status,
                revolutId: revolutId,
            }
            await axios.post("http://localhost:8080/persons", data,{timeout: 1000})
                .then((response) => {
                    console.log(response.data);
                    localStorage.setItem('list', JSON.stringify(persons));
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
                    <label className="input-group-text">Revolut id: </label>
                    <input className="form-control" type="text" value={revolutId} onChange={event => setRevolutId(event.target.value)}/>
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
export default AddPerson;