import { LightningElement, track } from 'lwc';
import ContactName from '@salesforce/schema/Salary__c.Contact__c';
import Year from '@salesforce/schema/Salary__c.Year__c';
import MonthName from '@salesforce/schema/Salary__c.Month__c';
import MonthSalary from '@salesforce/schema/Salary__c.Month_Salary__c';
//import PaidSalary from '@salesforce/schema/Salary__c.Paid_Salary__c';
import Tax from '@salesforce/schema/Salary__c.Tax__c';
export default class EditForm extends LightningElement {
    objectApiName = 'Salary__c';
    handleSuccess(event) {
        // handle success
    }
    handleClick() {
        // get the form element
        const form = this.template.querySelector('lightning-record-edit-form');
        // add empty fields to the form
        form.fields = [
            ...form.fields,
            {
                apiName: MonthName,
                value: ''
            },
            {
                apiName: Year,
                value: ''
            }
        ];
    }
}