import "../customBootstrap.scss";
import "./ExpenseList.style.css"
import {useContext,  useState} from "react";
import DeletePopUp from "./DeletePopUp.tsx";
import ExportPopUp from "./ExportPopUp.tsx";
import StackedDeletePopUp from "./StackedDeletePopUp.tsx";
import axios from "axios";
import ServerErrorPopUp from "./ServerErrorPopUp.tsx";
import {PersonContext} from "../PeopleContext.tsx";
import {Person} from "./Person.type.ts";
import PersonModal from "./PersonModal.tsx";
import {ExpenseContext} from "../ExpenseContext.tsx";
declare global {
    interface Navigator {
        msSaveBlob?: (blob: any, defaultName?: string) => boolean
    }
}
type Props = {
    onDeleteClickHnd: (data: Person) => void;
    onEdit: (data: Person) => void;
};
const PersonList = (props: Props) => {
    const {persons,setPersons}=useContext(PersonContext);
    const {expenses,setExpenses}=useContext(ExpenseContext);
    const {onDeleteClickHnd,onEdit} = props;
    const [showModal,setShowModal] = useState(false);
    const [dataToShow,setDataToShow] = useState(null as Person | null);
    const [nameSort,setNameSort]=useState(false);
    const [showDelete,setShowDelete]=useState(false);
    const [toDelete,setToDelete]= useState(null as Person|null);
    const [toExport,setToExport]=useState([] as Person[]);
    const [errorExport,setErrorExport]=useState(false);
    const [toDeleteList,setToDeleteList]=useState([] as Person[]);
    const [errorDelete,setErrorDelete]=useState(false);
    const [serverError,setServerError]=useState(false);
    const [srvErrName,setSrvErrName]=useState("");
    const [srvErrMsg,setSrvErrMsg]=useState("");
    const toCSV = (data:Person[]) =>{
        const header=Object.keys(data[0]);
        const csvContent=[
            header.join(','),
            ...data.map(obj=>header.map(key=>obj[key]).join(','))
        ].join('\n');
        return csvContent;
    }
    const saveToCsv = (toExport : Person[])=>{
        if (toExport.length===0){
            setErrorExport(true);
            return;
        }
        const csv=toCSV(toExport);
        const exportedFileName="exported.csv";
        const blob=new Blob([csv],{type: 'text/csv;charset=utf-8;'});
        if (navigator.msSaveBlob){
            navigator.msSaveBlob(blob, exportedFileName);
        }else{
            const link = document.createElement("a");
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
    const deleteList = async (data: Person[]) => {
        if (data.length === 0) {
            setErrorDelete(true);
            return;
        }
        // const temp = [...expenses];
        for (const person of data) {
            await axios.delete(`http://localhost:8080/persons/${person.id}`,{timeout: 1000}).then(response => console.log(response.data)).catch( function (error) {
                const err=error.toJSON();
                setSrvErrMsg(err.message);
                setSrvErrName(err.name);
                setServerError(true);
            });
            // const index = temp.indexOf(expense);
            // if (index !== -1) {
            //     temp.splice(index, 1);
            // }
            await axios.get("http://localhost:8080/expenses", {timeout: 1000}).then(response => {
                setExpenses(response.data);
            }).catch(function (error) {
                console.log(error.toJSON());
                // setSrvErrMsg(error.toJSON().message);
                // setSrvErrName(error.toJSON().name);
            });
            await axios.get(`http://localhost:8080/persons`,{timeout: 1000}).then(response=>setPersons(response.data)).catch( function (error) {
                const err=error.toJSON();
                setSrvErrMsg(err.message);
                setSrvErrName(err.name);
                setServerError(true);
            });
        }
        // setExpenses(temp);
        setToDeleteList([]);
        localStorage.setItem('personsList', JSON.stringify(persons));
    }
    const commitDelete = (data:Person)=>{
        deleteFromExport(data);
        deleteFromDelete(data);
        onDeleteClickHnd(data);
        setShowDelete(false);
    }
    const deleteFromExport = (data:Person)=>{
        const indexToDelete=toExport.indexOf(data);
        if (indexToDelete!==-1) {
            const tempList = [...toExport];
            tempList.splice(indexToDelete, 1);
            setToExport(tempList);
        }
    }
    const deleteFromDelete = (data:Person)=>{
        const indexToDelete=toDeleteList.indexOf(data);
        if (indexToDelete!==-1) {
            const tempList = [...toDeleteList];
            tempList.splice(indexToDelete, 1);
            setToDeleteList(tempList);
        }
    }
    const setExportState = (data:Person)=>{
        const indexExport=toExport.indexOf(data);
        if (indexExport!==-1){
            const tempList=[...toExport];
            tempList.splice(indexExport,1);
            setToExport(tempList);
        }else{
            setToExport([...toExport,data]);
        }
    }
    const setDeleteState = (data:Person)=>{
        const indexExport=toDeleteList.indexOf(data);
        if (indexExport!==-1){
            const tempList=[...toDeleteList];
            tempList.splice(indexExport,1);
            setToDeleteList(tempList);
        }else{
            setToDeleteList([...toDeleteList,data]);
        }
    }
    const sortName = async () => {
        if (!nameSort) {
            //const temp=persons.sort((a,b)=>(a.name<b.name ? 1:-1));
            //setPersons(temp);
            await axios.get(`http://localhost:8080/persons?field=name`, {timeout: 1000}).then(response => setPersons(response.data)).catch(function (error) {
                const err = error.toJSON();
                setSrvErrMsg(err.message);
                setSrvErrName(err.name);
                setServerError(true);
            });
            setNameSort(true);
        } else {
            //const temp = persons.sort((a, b) => (a.name < b.name ? -1 : 1));
            //setPersons(temp);
            await axios.get(`http://localhost:8080/persons?field=name&order=desc`,{timeout: 1000}).then(response=>setPersons(response.data)).catch( function (error) {
                const err=error.toJSON();
                setSrvErrMsg(err.message);
                setSrvErrName(err.name);
                setServerError(true);
            });
            setNameSort(false);
        }
    }

    const viewPerson = (data:Person) =>{
        setDataToShow(data);
        setShowModal(true);
    }
    // @ts-ignore
    return (<>
            <input type="button" value="Export" className="add-button" onClick={() => saveToCsv(toExport)}/>
            <input type="button" value="Delete" className="add-button" onClick={() => deleteList(toDeleteList)}/>
            <div>
                <h3>Person list</h3>
            </div>
            <div>
                <table className="table table-bordered border-primary">
                    <thead>
                    <tr>
                        <th>Name <button type="button" className="btn btn-primary btn-sm"
                                         onClick={sortName}>{nameSort ? '▲' : '▼'}</button></th>
                        <th>Status</th>
                        <th>Revolut</th>
                        <th className="actions">Actions</th>
                        <th className="export">Export</th>
                        <th className="export">Delete</th>
                    </tr>
                    </thead>
                    {persons.map((person) => {
                        return (
                            <tr key={person.id}>
                                <td>{person.name}</td>
                                <td>{person.status}</td>
                                <td>{person.revolutId}</td>
                                <td>
                                    <div className="action-button-container">
                                        <input type="button" value="View" onClick={() => viewPerson(person)}/>
                                        <input type="button" value="Edit" onClick={() => onEdit(person)}/>
                                        <input type="button" value="Delete" onClick={() => {
                                            setToDelete(person);
                                            setShowDelete(true);
                                            // onDeleteClickHnd(expense)
                                        }}/>
                                    </div>
                                </td>
                                <td>
                                    <div className="btn-group" role="group"
                                         aria-label="Basic checkbox toggle button group">
                                        <input type="checkbox" className="btn-check" id={person.id+"p"}
                                               onClick={() => setExportState(person)} autoComplete="off"/>
                                        <label className="btn btn-outline-primary" htmlFor={person.id+"p"}>X</label>
                                    </div>
                                </td>
                                <td>
                                    <div className="btn-group" role="group"
                                         aria-label="Basic checkbox toggle button group">
                                        <input type="checkbox" className="btn-check" id={person.id+"pd"}
                                               onClick={() => setDeleteState(person)} autoComplete="off"/>
                                        <label className="btn btn-outline-primary" htmlFor={person.id+"pd"}>X</label>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </table>
                {showModal && dataToShow !== null &&
                    <PersonModal onClose={() => setShowModal(false)} data={dataToShow}/>}
                {showDelete && toDelete !== null && <DeletePopUp onClose={() => setShowDelete(false)} commit={() => {
                    commitDelete(toDelete)
                }}/>}
                {errorExport && <ExportPopUp onClose={() => setErrorExport(false)}/>}
                {errorDelete && <StackedDeletePopUp onClose={() => setErrorDelete(false)}/>}
                {serverError && <ServerErrorPopUp message={srvErrMsg} name={srvErrName} onClose={()=>setServerError(false)}/>}
            </div>
        </>
    );

};

export default PersonList;
