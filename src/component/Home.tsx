import './Home.style.css'
import {useState} from "react";
// import {expenseList, InterfaceExpense, Pages} from "./Expense.type";
import ExpenseList from "./ExpenseList";
import AddExpense from "./AddExpense";
import EditExpense from "./EditExpense";
import {InterfaceExpense, Pages} from "./Expense.type.ts";

type Props ={
    expenses: InterfaceExpense[],
    setExpenses: (data:InterfaceExpense[])=>void,
    setDataToEdit: (data: InterfaceExpense)=>void
    dataToEdit: InterfaceExpense
}
const Home = (props: Props) =>{
    const {expenses,setExpenses,setDataToEdit,dataToEdit}=props;
    // const [expenses,setExpenses] = useState(expenseList as InterfaceExpense[]);
    const [shownPage,setShownPage] = useState(Pages.list);
    // const [dataToEdit,setDataToEdit] = useState(null as InterfaceExpense| null);
    return <>
        <article className="article-header">
            <header>
                <h1>Household Expenses</h1>
            </header>
        </article>
        <section className="section-content">
            {shownPage === Pages.list && <>
                <input type="button" value="Export" className="add-button"/>
                <input className="add-button" type="button" value="Add Expene" onClick={()=>setShownPage(Pages.add)}/>
                <ExpenseList list={expenses} onDeleteClickHnd={(data : InterfaceExpense) => {
                    const indexToDelete=expenses.indexOf(data);
                    const tempList = [...expenses];
                    tempList.splice(indexToDelete,1);
                    setExpenses(tempList);
                    localStorage.setItem('list',JSON.stringify(tempList));
                }} onEdit={(data: InterfaceExpense)=>{setDataToEdit(data);console.log(data);
                setShownPage(Pages.edit)
                }
                } setList={setExpenses}/>
            </>
            }
            {shownPage===Pages.add && <>
                <AddExpense onBackBtnClickHnd={()=>setShownPage(Pages.list)} onSubmitClickHnd={(data: InterfaceExpense) => {
                setExpenses([...expenses,data]);
                    localStorage.setItem('list',JSON.stringify([...expenses,data]));}
                }/>
            </>}
            {shownPage===Pages.edit && <>
                <EditExpense data={dataToEdit} onBackBtnClickHnd={()=>setShownPage(Pages.list)} onSubmitClickHnd={(data:InterfaceExpense) =>{
                    const objectToUpdate=expenses.filter(x=>x.id===data.id)[0];
                    const indexToUpdate=expenses.indexOf(objectToUpdate);
                    const tempData = [...expenses];
                    tempData[indexToUpdate]=data;
                    setExpenses(tempData);
                    localStorage.setItem('list',JSON.stringify(tempData));
                }
                }/>
            </>}
        </section>
        </>

}

export default Home;