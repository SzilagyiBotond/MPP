import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './customBootstrap.scss'
import App from "./component/App.tsx";
import Home from "./component/Home.tsx"
import {ExpenseProvider} from "./ExpenseContext.tsx";
import {PersonProvider} from "./PeopleContext.tsx";

// @ts-ignore
ReactDOM.createRoot(document.getElementById('root')!).render(
    <PersonProvider>
      <ExpenseProvider>
          {/*<App />*/}
          <Home/>
      </ExpenseProvider>
    </PersonProvider>
)
