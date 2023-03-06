import { LightningElement, wire} from 'lwc';
import { exportCSVFile } from 'c/utils';
import getSalary from '@salesforce/apex/TestSalaryControllerCSV.getSalaryRec';
export default class TestCSVComp extends LightningElement {
    // userData= [
    //     {
    //         username:"Nikhil",
    //         age:25,
    //         title:"Developer"
    //     },
    //     {
    //         username: 'Salesforcetroop',
    //         age: 2,
    //         title: 'Youtube channel'
    //     },
    //     {
    //         username: 'Friends',
    //         age: 20,
    //         title: 'Netflix series'
    //     }
    // ]

    // headers = {
    //     username:"User Name",
    //     age:"Age",
    //     title:"Title"
    // }
    // downloadUserDetails(){
    //     console.log("download triggered.")
    //     exportCSVFile(this.headers, this.userData, "user detail")
    // }
    salarydata;
    error;
    @wire(getSalary)
    wiredSalary({ data, error }){
        if(data){
            this.salarydata = data; 
            console.log(salarydata);
        }else if(error){
            this.error = error;
            console.log(error);
        }
    } 
    SalaryHeaders ={
        Name:"Name",
        Month__c:"Month",
        Paid_Salary__c:"Paid Salary",
        Year__c: "Year"
    }
    downloadSalaryData(){
        console.log("download triggered.");
        exportCSVFile(this.SalaryHeaders, this.salarydata, "Salary detail")
    }
}