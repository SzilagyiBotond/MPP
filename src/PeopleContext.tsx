import React, {createContext, useState} from "react";
import {Person} from "./component/Person.type.ts";

const PersonContext= createContext<{
    persons: Person[];
    setPersons: React.Dispatch<React.SetStateAction<Person[]>>;
}>({persons: [], setPersons: ()=>{}});

// @ts-ignore
const PersonProvider: React.FC = ({children}) =>{
    const [persons,setPersons] = useState<Person[]>([]);
    return(
        <PersonContext.Provider value={{persons,setPersons}}>
            {children}
        </PersonContext.Provider>
    )
}

export {PersonProvider,PersonContext};