import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Home.tsx";
import AddExpense from "./AddExpense.tsx";
import EditExpense from "./EditExpense.tsx";
import {expenseList, InterfaceExpense} from "./Expense.type";
import {useContext, useEffect, useState} from "react";
import {ExpenseContext} from "../ExpenseContext.tsx";
import axios from "axios";
const App = ()=>{
    const {expenses,setExpenses} = useContext(ExpenseContext);

    useEffect(() => {
        // const retrieveKeys = () =>{
        //     const keys=Object.keys(localStorage);
        //     keys.map((key) =>{
        //         if(key.toString()==='list'){
        //             const data=localStorage.getItem(key);
        //             if(data){
        //                 const parsed=JSON.parse(data);
        //                 setExpenses(parsed);
        //             }
        //         }
        //
        //     })
        // }
        // retrieveKeys();
        axios.get("http://localhost:8080/expenses")
            .then(function (response){
                setExpenses(response.data);
                console.log(response.data);
            })
        localStorage.setItem('list',JSON.stringify(expenses));
    }, []);

    return <BrowserRouter>
        <Routes>
            <Route index element={<Home />}></Route>
            <Route path='/add' element={<AddExpense  />}></Route>
            <Route path='/update/:id' element={<EditExpense />}></Route>
        </Routes>
    </BrowserRouter>
}
export default App;