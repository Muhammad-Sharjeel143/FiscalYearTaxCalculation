import { LightningElement, api , wire} from 'lwc';
import getSalaryRecord from '@salesforce/apex/SalaryController.getSalaryRecord';
import { refreshApex } from '@salesforce/apex';

const Columns = [
    
    {label: 'CONTACT NAME', fieldName: 'Name'},
    {label: 'CONTACT CNIC', fieldName: 'CNIC'},
    {label: 'MONTH', fieldName: 'Month'},
    {label: 'MONTH SALARY', fieldName: 'Salary'},
    {label: 'TAX', fieldName: 'Tax'},
    {label: 'PAID SALARY', fieldName: 'PaidSalary'},
    {label: 'SALARY YEAR', fieldName: 'Year'},
    ]
export default class TaxRecord extends LightningElement {
    @api columns= Columns;
    wiredata;
    wireShowData;
    error;
    @wire(getSalaryRecord)
    wiredSalary({data,error}){
        if(data){
            this.wiredata = data.map(row=>{
                return{...row, Name: row.Contact__r.Name,CNIC:row.Contact__r.CNIC__c,Month: row.Month__c,Salary:row.Month_Salary__c, Tax:row.Tax__c,PaidSalary: row.Salary_To_Be_Paid__c, Year:row.Year__c }
            })
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }
    // insertHandler(){
    //     return refreshApex(this.wiredata);
    // }
    downloadCSVFile() {   
        let rowEnd = '\n';
        let csvString = '';
        // this set elminates the duplicates if have any duplicate keys
        let rowData = new Set();
        // getting keys from data
        this.wiredata.forEach(function (record) {
            Object.keys(record).forEach(function (key) {
                if(key==='Name'){
                    key= 'Name';
                    rowData.add(key);
                }
                else if(key==='CNIC'){
                    key= 'CNIC';
                    rowData.add(key);
                }
                else if(key === 'Month__c'){
                    key ='Month';
                    rowData.add(key);
               } else if(key === 'Month_Salary__c'){
                    key ='Salary';
                    rowData.add(key);
               }else if(key === 'Tax__c'){
                    key ='Tax';
                    rowData.add(key);
               }else if(key === 'Year__c'){
                    key ='Year';
                    rowData.add(key);
               }
               else if(key === 'Salary_To_Be_Paid__c'){
                key ='PaidSalary';
                rowData.add(key);
           }
            });
        });
        // Array.from() method returns an Array object from any object with a length property or an iterable object.
        rowData = Array.from(rowData);
        let newRowData =  ["Name","CNIC","Month","Salary","Tax","PaidSalary","Year"];
        rowData = newRowData;
        
        // splitting using ','
        csvString += rowData.join(',');
        csvString += rowEnd;

        // main for loop to get the data based on key value
        for(let i=0; i < this.wiredata.length; i++){
            let colValue = 0;
 
            // validating keys in data
            for(let key in rowData) {
                if(rowData.hasOwnProperty(key)) {
                    // Key value  
                    // Ex: , Name:
                    let rowKey = rowData[key];
                    // add , after every value except the first.
                    if(colValue > 0){
                        csvString += ',';
                    }
                    // If the column is undefined, it as blank in the CSV file.
                    let value = this.wiredata[i][rowKey] === undefined ? '' : this.wiredata[i][rowKey];
                    csvString += '"'+ value +'"';
                    colValue++;
                }
            }
            csvString += rowEnd;
        }
 
        // Creating anchor element to download
        let downloadElement = document.createElement('a');
 
        // This  encodeURI encodes special characters, except: , / ? : @ & = + $ # (Use encodeURIComponent() to encode these characters).
        downloadElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
        downloadElement.target = '_self';
        // CSV File Name
        downloadElement.download = 'incomeTax.csv';
        // below statement is required if you are using firefox browser
        document.body.appendChild(downloadElement);
        // click() Javascript function to download CSV file
        downloadElement.click(); 
    }
}