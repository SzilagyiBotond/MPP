import {Person} from "./Person.type.ts";

export interface InterfaceExpense{
    id: string;
    name: string;
    price: number;
    paid: Person;
    description: string;
    date: Date;
    currency: string;
}
export const expenseList: InterfaceExpense[]=[{
    id: Math.random().toString().slice(2),
    name: "Lidl",
    price: 120,
    paid: "Gabi",
    description: "20 liter tej",
    date: new Date("2024-01-16"),
    currency: "LEI"
}];

export enum Pages{
    list,
    add,
    edit,
    addPerson,
    editPerson
}