import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import {useContext} from "react";
import {ExpenseContext} from "../ExpenseContext.tsx";
const webSocketUrl = 'ws://localhost:8080/websocket';
class WebSocketService{
    private stompClient: Stomp.Client | null=null;
    // private messageCallback: ((message:any)=>void)|null=null;

    connect(){
        const socket=new SockJS(webSocketUrl);
        this.stompClient=Stomp.over(socket);
        this.stompClient.connect({},()=>{
            console.log("Connected to websocket");
        });
        this.stompClient?.subscribe('expenses/generated',(message:Stomp.Message)=>{
            const expense=JSON.parse(message.body);
            // if (this.messageCallback){
            //     this.messageCallback(expense);
            // }
            const {expenses,setExpenses}=useContext(ExpenseContext);
            setExpenses([...expenses,expense]);
        });
    }
    disconnect(){
        if (this.stompClient){
            // @ts-ignore
            this.stompClient.disconnect();
            console.log("Disconnected from the websocket");
        }
    }

    // setCallback(callback: (message: any)=>void){
    //     this.messageCallback=callback;
    // }
}

export default new WebSocketService();