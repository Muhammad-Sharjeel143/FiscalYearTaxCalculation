import { LightningElement , api , track} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import ContactName from '@salesforce/schema/Salary__c.Contact__c';
import YEAR from '@salesforce/schema/Salary__c.Year__c';
import MonthName from '@salesforce/schema/Salary__c.Month__c';
import MonthSalary from '@salesforce/schema/Salary__c.Month_Salary__c';
import { NavigationMixin } from 'lightning/navigation';
import   AddRow from '@salesforce/label/c.Add_Row';
import   SubmitRows from '@salesforce/label/c.Submit_Request';
import insertSalary from '@salesforce/apex/SalaryController.insertSalary';

export default class MultipleSalariesInsertion extends NavigationMixin(LightningElement){
    keyIndex = 0;
    label = {
        ContactName,
        MonthName,
        MonthSalary,
        YEAR
    }
    @track itemList = [
        {
            id: 0
        }
    ];
    nameList =[];
    monthList =[];
    salaryList =[];
    yearList =[];
    newSalaryList = [];

    addRow() {
        ++this.keyIndex;
        let newItem = [{ id: this.keyIndex }];
        this.itemList.push(newItem);
    }
    removeRow(event) {
        if (this.itemList.length > 1) {
        let index = event.target.dataset.index;               //dataset property is used to get value of data-index attribute
                            //item that is processed , index of that item
        this.itemList = this.itemList.filter(( item, curIndex ) => curIndex !== parseInt(index)); //filter method creates a new list without specified index and assign to list
        }
    }
    handleNameChange(event) {
       
        // const fields = event.detail.fields;
        for(let i = 0 ;i<this.itemList.length; i++){
            this.nameList[i] = event.detail.id;  
            // this.label.ContactName = event.detail.id;    
        }
        
        console.log(JSON.stringify(this.nameList));
        
        // window.console.log("ContactName", this.rec.ContactName);
        
    }
    handleMonthChange(event) {
        
        for(let i = 0 ;i<this.itemList.length; i++){
            this.monthList[i] = event.detail.value;  
            console.log(JSON.stringify(this.monthList[i]));     
        }
        // this.label.MonthName = event.detail.value;
        
        // window.console.log("MonthName", this.rec.MonthName);
    }
    handleSalaryChange(event) {
        for(let i = 0 ;i<this.itemList.length; i++){
            this.salaryList[i] = event.detail.value;  
            // this.label.ContactName = event.detail.id;  
            console.log(JSON.stringify(this.salaryList[i]));  
        }
        // this.label.MonthSalary = event.detail.value;
        
        // window.console.log("MonthSalary", this.rec.MonthSalary);
    }
    handleYearChange(event) {
        for(let i = 0 ;i<this.itemList.length; i++){
            this.yearList[i] = event.detail.value;  
            console.log(JSON.stringify(this.yearList[i]));
            // this.label.ContactName = event.detail.id;    
        }
        // this.label.YEAR = event.detail.value;
        
        // window.console.log("Year", this.rec.Year);
    }
    handleSubmit() {
        
        // insertSalary ({ contactId:this.label.ContactName , month:this.label.MonthName ,monthSalary:this.label.MonthSalary, year:this.label.YEAR })
        for(let i = 1 ;i<=this.itemList.length; i++){
            salary[i] = {
                Contact__c: this.nameList[i],
                Month__c: this.monthList[i],
                Month_Salary__c: this.salaryList[i],
                Year__c: this.yearList[i]
            }    
        }
        this.salaryList = salary ;  
      
         insertSalary ({ salary: salary })    
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Salary created',
                        variant: 'success',
                    }),
                );
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                console.log('error', JSON.stringify(error));
            });
        //     // const forms = Array.from(this.template.querySelectorAll('lightning-record-edit-form'));
        //     // forms.map(form => form.submit());
        //     this.template.querySelectorAll('lightning-record-edit-form').forEach(element => {
        //         element.submit();
        //     });
        //     this[NavigationMixin.Navigate]({
        //         type: 'standard__objectPage',
        //         attributes: {
        //             objectApiName: 'Salary__c',                    
        //             actionName: 'home'
        //         },
        //     });
        //     const toastEvent = new ShowToastEvent({
        //         title: 'Salary Created',
        //         message: 'New Salaries are Created',
        //         variant: 'success'
        //     });
        //     this.dispatchEvent(toastEvent);
        // } else {
        //     const errortoastEvent = new ShowToastEvent({
        //     title: 'Salary Error',
        //     message: 'Required Salary fields should not be empty',
        //     variant: 'error'
        // });
        // this.dispatchEvent(errortoastEvent);
        // }
        }
    }