import { LightningElement, api, wire } from 'lwc';
import getSalary from '@salesforce/apex/SalaryController.getFieldSet';

export default class MyComponent extends LightningElement {
     @api recordId;
     @wire(getSalary)
     inputFields;
    // fields = ['Contact__c','Month__c', 'Month_Salary__c','Year__c']; // List of fields in the fieldset

    // handleSuccess() {
    //     // handle success logic
    // }
}