import { LightningElement, api ,track, wire } from 'lwc';
import SALARY_OBJECT from '@salesforce/schema/Salary__c';
import SALARY_MONTH_NAME from '@salesforce/schema/Salary__c.Month__c';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getSalary from '@salesforce/apex/SalaryController.getSalary';

const Columns = [ //Columns to show in the dataTable
    {label: 'CONTACT NAME', fieldName: 'Name'},
    {label: 'CONTACT CNIC', fieldName: 'CNIC'},
    {label: 'MONTH', fieldName: 'Month', cellAttributes: { style: 'font-weight: bold' }},
    {label: 'MONTH SALARY', fieldName: 'Salary'},
    {label: 'TAX', fieldName: 'Tax'},
    {label: 'PAID SALARY', fieldName: 'PaidSalary'},
    {label: 'SALARY YEAR', fieldName: 'Year'},
    ]
const totalSumColumns = [
    {label: 'TOTAL', fieldName: 'Month', cellAttributes: { style: 'font-weight: bold' } },
    {label: 'TOTAL MONTH SALARY', fieldName: 'Salary'},
    {label: 'TOTAL TAX', fieldName: 'Tax'},
    {label: 'TOTAL PAID SALARY', fieldName: 'PaidSalary'},
]
export default class taxMonthlyReport extends LightningElement {
    columns =Columns;
    totalSumColumns = totalSumColumns; 
    @api month; //declaring month variable to use in Imperative function
    dataTableShowRecord; //declaring variable to show record in the dataTable
    dataTableRecord; //declaring variable for dataTable record to manipulate later
    picklistOptions; //for comboxBox options
    totalSumDataTable;
    @wire(getObjectInfo, { objectApiName: SALARY_OBJECT }) //getObjectInfo is to get info about object
    SalariesInfo;
    @wire(getPicklistValues, { recordTypeId: '$SalariesInfo.data.defaultRecordTypeId', fieldApiName: SALARY_MONTH_NAME }) //for picking picklist values
    wiredPicklistValues({ error, data }) {
        if (data) {
            this.picklistOptions = data.values;
        } 
        else if (error) {
            console.log(error);
        }
    }
    handleChange(event) {
        this.month = event.detail.value;  
        getSalary({ month: this.month }) //Apex Imperative function
            .then((result) => { //when the result is true
                this.dataTableRecord = result.map(row=>{ //mapping the result to get the fieldName from the imperative funtion to use as fieldName in Columns
                    return{...row, 
                        Name :row.Contact__r.Name,CNIC :row.Contact__r.CNIC__c,
                        Month :row.Month__c,Salary :row.Month_Salary__c, Tax :row.Tax__c,
                        PaidSalary :row.Salary_To_Be_Paid__c, Year :row.Year__c 
                    }               
                });
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.dataTableRecord = undefined;
            });
    }
    handleClick(){
        this.dataTableShowRecord = this.dataTableRecord; //On handleCLick we are showing the dataTable Record
        let sumofSalaryFields = this.dataTableRecord.reduce((salary , record)=>{ // to sum up all records of following fields
            salary.Month_Salary__c += Math.round(record.Month_Salary__c) ;  
            salary.Tax__c += Math.round(record.Tax__c); 
            salary.Salary_To_Be_Paid__c += Math.round(record.Salary_To_Be_Paid__c);
            salary.Month__c = record.Month__c;
            return salary;
        },
        { Month_Salary__c: 0 ,Salary_To_Be_Paid__c:0 ,Tax__c:0 });
        this.totalSumDataTable = [{    
            Month :'Totals:', Salary :sumofSalaryFields.Month_Salary__c,
            Tax :sumofSalaryFields.Tax__c , PaidSalary :sumofSalaryFields.Salary_To_Be_Paid__c
        }];
    }
    downloadCSVFile() {      
        let rowEnd = '\n';
        let csvString = '';
        // this set elminates the duplicates if have any duplicate keys
        let rowData = new Set();
        // let rowData1 = new Set();
        // getting keys from data
        this.dataTableShowRecord.forEach(function (record) {
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
                }
                else if(key === 'Month_Salary__c'){
                    key ='Salary';
                    rowData.add(key);
                }
                else if(key === 'Tax__c'){
                    key ='Tax';
                    rowData.add(key);
                }
                else if(key === 'Year__c'){
                    key ='Year';
                    rowData.add(key);
                }
                else if(key === 'Salary_To_Be_Paid__c'){
                    key = 'PaidSalary';
                    rowData.add(key);
                }   
            });
        });
        this.totalSumDataTable.forEach(function (record) {
            Object.keys(record).forEach(function (key) {
                if(key==='Month__c'){
                    key= 'Month';
                    rowData.add(key);
                }
                else if(key === 'Month_Salary__c'){
                    key ='Salary';
                    rowData.add(key);
                }
                else if(key === 'Tax__c'){
                    key ='Tax';
                    rowData.add(key);
                }
                else if(key === 'Salary_To_Be_Paid__c'){
                    key = 'PaidSalary';
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
        for(let i=0; i < this.dataTableShowRecord.length; i++){
            let colValue = 0;
            // validating keys in data
            for(let key in rowData) {
                if(rowData.hasOwnProperty(key)) {
                    // Key value 
                    // Ex: Id, Name
                    let rowKey = rowData[key];
                    // add , after every value except the first.
                    if(colValue > 0){
                        csvString += ',';
                    }
                    // If the column is undefined, it as blank in the CSV file.
                    let value = this.dataTableShowRecord[i][rowKey] === undefined ? '' : this.dataTableShowRecord[i][rowKey];
                    csvString += '"'+ value +'"';
                    colValue++;
                }
            }
            csvString += rowEnd;
        }
        for(let i=0; i < this.totalSumDataTable.length; i++){
            let colValue = 0;
            // validating keys in data
            for(let key in rowData) {
                if(rowData.hasOwnProperty(key)) {
                    // Key value 
                    // Ex: Id, Name
                    let rowKey = rowData[key];
                    // add , after every value except the first.
                    if(colValue > 0){
                        csvString += ',';
                    }
                    // If the column is undefined, it as blank in the CSV file.
                    let value = this.totalSumDataTable[i][rowKey] === undefined ? '' : this.totalSumDataTable[i][rowKey];
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