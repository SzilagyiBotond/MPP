import React, {createContext, ReactNode, useState} from "react";
import {InterfaceExpense} from "./component/Expense.type.ts";

// interface ExpenseProviderProps{
//     children: ReactNode;
// }

const ExpenseContext= createContext<{
    expenses: InterfaceExpense[];
    setExpenses: React.Dispatch<React.SetStateAction<InterfaceExpense[]>>;
}>({expenses: [], setExpenses: ()=>{}});

// @ts-ignore
const ExpenseProvider: React.FC = ({children}) =>{
    const [expenses,setExpenses] = useState<InterfaceExpense[]>([]);
    return(
    <ExpenseContext.Provider value={{expenses,setExpenses}}>
        {children}
    </ExpenseContext.Provider>
    )
}

export {ExpenseProvider,ExpenseContext};