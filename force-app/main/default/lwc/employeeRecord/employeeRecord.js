import { LightningElement} from 'lwc';
import SALARY_YEAR_NAME from '@salesforce/schema/Salary__c.Year__c';
import SALARY_CONTACT_NAME from '@salesforce/schema/Salary__c.Contact__c';
import getEmployeeRecord from '@salesforce/apex/SalaryController.getEmployeeRecord';
import CONTACTLABEL from '@salesforce/label/c.Contact_Name';
import YEARLABEL from '@salesforce/label/c.Year';

const Columns = [
    {
        label: 'CONTACT NAME',
        fieldName: 'Name',
    },
    {
        label: 'CONTACT CNIC',
        fieldName: 'CNIC'
    },
    {
        label: 'MONTH',
        fieldName: 'Month'
    },
    {
        label: 'MONTH SALARY',
        fieldName: 'Salary'
    },
    {
        label: 'TAX',
        fieldName: 'Tax',
        
    },
    {
        label: 'PAID SALARY',
        fieldName: 'PaidSalary'
    },
    {
        label: 'SALARY YEAR',
        fieldName: 'Year',
        cellAttributes: { style: 'font-weight: bold' }
    },
]
const totalSumColumns = [
    {
        label: 'TOTAL',
        fieldName: 'Month',
        cellAttributes: { style: 'font-weight: bold' }
    },
    {
        label: 'TOTAL MONTH SALARY',
        fieldName: 'Salary'
    },
    {
        label: 'TOTAL TAX',
        fieldName: 'Tax'
    },
    {
        label: 'TOTAL PAID SALARY',
        fieldName: 'PaidSalary'
    }
]
export default class EmployeeRecord extends LightningElement {
    columns = Columns;
    totalSumColumns = totalSumColumns; 
    selectedYear;
    selectedContactId;
    dataTableShowRecord;
    dataTableRecord;
    totalSumDataTable;
    fields = {
        SALARY_CONTACT_NAME,
        SALARY_YEAR_NAME
    };
    label ={
        CONTACTLABEL,
        YEARLABEL
    }
    handleNameChange(event){
        this.selectedContactId = event.target.value;
    }
    handleYearChange(event){
        this.selectedYear = event.detail.value;
    }
    handleRecordChnage(){
        getEmployeeRecord({contactID :this.selectedContactId, year :this.selectedYear})
        .then((result) => {
            this.dataTableRecord = result.map(row=>{
                return{...row, 
                    Name :row.Contact__r.Name,CNIC :row.Contact__r.CNIC__c,
                    Month :row.Month__c,Salary :row.Month_Salary__c,
                    Tax :row.Tax__c,PaidSalary :row.Salary_To_Be_Paid__c, Year :row.Year__c
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
        this.dataTableShowRecord = this.dataTableRecord;
        let sumofSalaryFields = this.dataTableRecord.reduce((salary , record)=>{ 
            salary.Month_Salary__c += Math.round(record.Month_Salary__c) ;  
            salary.Tax__c += Math.round(record.Tax__c); 
            salary.Salary_To_Be_Paid__c += Math.round(record.Salary_To_Be_Paid__c);
            return salary;
        },
        { 
            Month_Salary__c: 0 ,Salary_To_Be_Paid__c:0 ,Tax__c:0 
        });
        this.totalSumDataTable = [{    
            Month :'Totals:', Salary :sumofSalaryFields.Month_Salary__c,
            Tax :sumofSalaryFields.Tax__c , PaidSalary :sumofSalaryFields.Salary_To_Be_Paid__c
        }];
        // const newRow = {
        //     Month :'Total:', Salary :sumofSalaryFields.Month_Salary__c,
        //     Tax :sumofSalaryFields.Tax__c ,PaidSalary :sumofSalaryFields.Salary_To_Be_Paid__c, Year :sumofSalaryFields.Year__c
        // };
        // this.dataTableShowRecord = this.dataTableRecord.concat(newRow);
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
        // rowData1 = Array.from(rowData1);
        let newRowData =  ["Name","CNIC","Month","Salary","Tax","PaidSalary","Year"]; 
        // let newRowData1 =  ["","",""]; 
        rowData = newRowData;
        // rowData1 = newRowData;
        // splitting using ','
        csvString += rowData.join(',');
        // csvString += rowData1.join(',');
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