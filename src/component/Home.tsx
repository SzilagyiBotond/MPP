import './Home.style.css'
import {useContext, useEffect, useState} from "react";
// import {expenseList, InterfaceExpense, Pages} from "./Expense.type";
import ExpenseList from "./ExpenseList";
import AddExpense from "./AddExpense";
import EditExpense from "./EditExpense";
import {InterfaceExpense, Pages} from "./Expense.type.ts";
import {ExpenseContext} from "../ExpenseContext.tsx";
import axios from "axios";
import ServerErrorPopUp from "./ServerErrorPopUp.tsx";
import Stomp from "stompjs";
import {PersonContext} from "../PeopleContext.tsx";
import PersonList from "./PersonList.tsx";
import {Person} from "./Person.type.ts";
import AddPerson from "./AddPerson.tsx";
import EditPerson from "./EditPerson.tsx";

Object.assign(global, { WebSocket });

const Home = () =>{
    const {expenses,setExpenses}=useContext(ExpenseContext);
    const {persons,setPersons}=useContext(PersonContext);
    const [dataToEdit,setDataToEdit] = useState(null as unknown as InterfaceExpense);
    const [personToEdit,setPersonToEdit]=useState(null as unknown as Person);
    // const [expenses,setExpenses] = useState(expenseList as InterfaceExpense[]);
    const [shownPage,setShownPage] = useState(Pages.list);
    const [serverError,setServerError]=useState(false);
    const [srvErrName,setSrvErrName]=useState("");
    const [srvErrMsg,setSrvErrMsg]=useState("");
    useEffect(() => {

        axios.get("http://localhost:8080/expenses",)
            .then(function (response){
                setExpenses(response.data);
                console.log(response.data);
            }).catch( function (error) {
            const err=error.toJSON();
            if(!err.response){
                setSrvErrName("Error: "+err.name);
                setSrvErrMsg("A network error occurred: "+ err.message + " " +"Entities are immutable");
            }else{
                setSrvErrName(err.response);
                setSrvErrMsg("An error occurred: "+err.message);
            }
            // setSrvErrMsg(err.message);
            // setSrvErrName(err.name);
            setServerError(true);
        });
        axios.get("http://localhost:8080/persons",)
            .then(function (response){
                setPersons(response.data);
                console.log(response.data);
            }).catch( function (error) {
            const err=error.toJSON();
            if(!err.response){
                setSrvErrName("Error: "+err.name);
                setSrvErrMsg("A network error occurred: "+ err.message + " " +"Entities are immutable");
            }else{
                setSrvErrName(err.response);
                setSrvErrMsg("An error occurred: "+err.message);
            }
            // setSrvErrMsg(err.message);
            // setSrvErrName(err.name);
            setServerError(true);
        });

    }, [shownPage]);
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/websocket');

        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/generated', (message) => {
                const expense = JSON.parse(message.body);
                console.log(expense);
                setExpenses(prevExpenses => [...prevExpenses, expense]);
                localStorage.setItem('list',JSON.stringify(expenses));
            });
        });

        // Cleanup function
        // return () => {
        //     // Disconnect from WebSocket and STOMP
        //     stompClient.disconnect();
        // };
    }, []);
    return <>
        <article className="article-header">
            <header>
                <h1>Household Expenses</h1>
            </header>
        </article>
        <section className="section-content">
            {shownPage === Pages.list && <>
                <input className="add-button" type="button" value="Add Expene" onClick={() => setShownPage(Pages.add)}/>
                <ExpenseList onDeleteClickHnd={async (data: InterfaceExpense) => {
                    await axios.delete(`http://localhost:8080/expenses/${data.id}`, {timeout: 1000}).then(response => console.log(response)).catch(function (error) {
                        const err = error.toJSON();
                        setSrvErrMsg(err.message);
                        setSrvErrName(err.name);
                        setServerError(true);
                    });
                    await axios.get("http://localhost:8080/expenses", {timeout: 1000}).then(response => {
                        setExpenses(response.data);
                    }).catch(function (error) {
                        console.log(error.toJSON());
                        // setSrvErrMsg(error.toJSON().message);
                        // setSrvErrName(error.toJSON().name);
                    });
                    localStorage.setItem('list', JSON.stringify(expenses));
                }} onEdit={(data: InterfaceExpense) => {
                    setDataToEdit(data);
                    setShownPage(Pages.edit)
                }
                }/>
                <input className="add-button" type="button" value="Add person" onClick={() => setShownPage(Pages.addPerson)}/>
                <PersonList onDeleteClickHnd={async (data: Person) => {
                    await axios.delete(`http://localhost:8080/persons/${data.id}`, {timeout: 1000}).then(response => console.log(response)).catch(function (error) {
                        const err = error.toJSON();
                        setSrvErrMsg(err.message);
                        setSrvErrName(err.name);
                        setServerError(true);
                    });
                    await axios.get("http://localhost:8080/persons", {timeout: 1000}).then(response => {
                        setPersons(response.data);
                    }).catch(function (error) {
                        console.log(error.toJSON());
                        // setSrvErrMsg(error.toJSON().message);
                        // setSrvErrName(error.toJSON().name);
                    });
                    await axios.get("http://localhost:8080/expenses", {timeout: 1000}).then(response => {
                        setExpenses(response.data);
                    }).catch(function (error) {
                        console.log(error.toJSON());
                        // setSrvErrMsg(error.toJSON().message);
                        // setSrvErrName(error.toJSON().name);
                    });
                    localStorage.setItem('list', JSON.stringify(expenses));
                    localStorage.setItem('personList', JSON.stringify(persons));
                }} onEdit={(data: Person) => {
                    setPersonToEdit(data);
                    setShownPage(Pages.editPerson)
                }}/>
            </>
            }
            {shownPage === Pages.add && <>
                <AddExpense onBackBtnClickHnd={()=>setShownPage(Pages.list)}/>
            </>}
            {shownPage===Pages.edit && <>
                <EditExpense data={dataToEdit} onBackBtnClickHnd={()=>setShownPage(Pages.list)}/>
            </>}
            {shownPage===Pages.editPerson && <>
                <EditPerson data={personToEdit} onBackBtnClickHnd={()=>setShownPage(Pages.list)}/>
            </>}
            {shownPage===Pages.addPerson &&
                <AddPerson onBackBtnClickHnd={()=>setShownPage(Pages.list)}></AddPerson>
            }
            {serverError && <ServerErrorPopUp message={srvErrMsg} name={srvErrName} onClose={()=>setServerError(false)}/>}
        </section>
        </>

}

export default Home;