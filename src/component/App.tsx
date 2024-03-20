import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Home.tsx";
import AddExpense from "./AddExpense.tsx";
import EditExpense from "./EditExpense.tsx";
import {InterfaceExpense} from "./Expense.type";
import {useEffect, useState} from "react";
const App = ()=>{
    const [expenses,setExpenses] = useState([] as InterfaceExpense[]);
    const [dataToEdit,setDataToEdit] = useState(null as unknown as InterfaceExpense);
    useEffect(() => {
        const retrieveKeys = () =>{
            const keys=Object.keys(localStorage);
            keys.map((key) =>{
                if(key.toString()==='list'){
                    const data=localStorage.getItem(key);
                    if(data){
                        const parsed=JSON.parse(data);
                        setExpenses(parsed);
                    }
                }

            })
        }
        retrieveKeys();
    }, []);

    return <BrowserRouter>
        <Routes>
            <Route index element={<Home expenses={expenses} setExpenses={setExpenses} setDataToEdit={setDataToEdit} dataToEdit={dataToEdit}/>}></Route>
            <Route path='/add' element={<AddExpense  />}></Route>
            <Route path='/update/:id' element={<EditExpense />}></Route>
        </Routes>
    </BrowserRouter>
}
export default App;