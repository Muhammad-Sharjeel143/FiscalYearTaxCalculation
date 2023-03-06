import { LightningElement , api , track} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import CONTACTNAME from '@salesforce/schema/Salary__c.Contact__c';
import MONTHNAME from '@salesforce/schema/Salary__c.Month__c';
import MONTHSALARY from '@salesforce/schema/Salary__c.Month_Salary__c';
import YEAR from '@salesforce/schema/Salary__c.Year__c';
import ADDROWLABEL from '@salesforce/label/c.Add_Row';
import DELETEROWLABEL from '@salesforce/label/c.Delete_Row';
import SUBMITROWLABEL from '@salesforce/label/c.Submit_Request';
import CONTACTLABEL from '@salesforce/label/c.Contact_Name';
import MONTHLABEL from '@salesforce/label/c.Month_Name';
import SALARYLABEL from '@salesforce/label/c.Month_Salary';
import YEARLABEL from '@salesforce/label/c.Year';
import insertSalary from '@salesforce/apex/SalaryController.insertSalary';
export default class CreateContactSalaryInsertion extends NavigationMixin(LightningElement){
    keyIndexofRow = 0;   //Starting index of row
    field = {            //salary fileds
        CONTACTNAME,
        MONTHNAME,
        MONTHSALARY,
        YEAR
    };
    label ={           //Custom labels
        ADDROWLABEL,
        DELETEROWLABEL,
        SUBMITROWLABEL,
        CONTACTLABEL,
        MONTHLABEL,
        SALARYLABEL,
        YEARLABEL
    };
    @track itemList = [  //List of items(fields)
        {
            id: 0
        }
    ];
    addRow() {
        ++this.keyIndexofRow;
        let newItemList = [{ id: this.keyIndexofRow }]; //this will add new row index in the newitemlist variable
        this.itemList.push(newItemList); //it will push the new row in the current list
    }
    removeRow(event) {
        if (this.itemList.length > 1) { //it will check the length of itemlist if greater than 1 because 1 row should be left in the list
        let indexOfRow = event.target.dataset.index;  //dataset property is used to get value of data-index attribute
        this.itemList = this.itemList.filter(( item, curentIndex ) => curentIndex !== parseInt(indexOfRow)); //item that is processed , index of that item, filter method creates a new list without specified index and assign to list
        }
    }
    handleSubmit() {
        let validityOfFields = true; //to check the fields validity
        this.template.querySelectorAll('lightning-input-field').forEach(element => { //loop on each input fields 
            validityOfFields = validityOfFields &&   element.reportValidity(); // reportvalidity method check validity of form fields and return boolean value.
        });
        if (validityOfFields) { //it will check if the validity is true than enter into the code block
            let newSalaries = [];  //list of salaries to be add in
            this.template.querySelectorAll('lightning-record-edit-form').forEach(element => { //loop on each lightning record edit form
                let newSalary = {}; //new inserted salary in record edit form to be add in it 
                element.querySelectorAll('lightning-input-field').forEach(field => { //loop on each input fields 
                newSalary[field.fieldName] = field.value; //each field of salary will be added into newSalary with index of its field name
                });
                console.log(JSON.stringify(newSalary));
                newSalaries.push(newSalary); //pushing the newSalary into the list of salary
            });
            insertSalary({newSalaries :newSalaries}) //Apex Imperative giving the value of list of salaries(newSalaries)
            .then(() => { //after the call is true 
                this[NavigationMixin.Navigate]({ //it will navigate from current form to the home page of Salary
                    type: 'standard__objectPage',
                    attributes: {
                        objectApiName: 'Salary__c',
                        actionName: 'home',
                    },
                });
            this.dispatchEvent(  //it will dispatch event of success message
                new ShowToastEvent({
                        title: 'Success', 
                        message: 'Salary successfully created',
                        variant: 'success',
                    }),
                );
            })
            .catch((error) => { //if the imperative gets any error 
                this.dispatchEvent( // this will dispatch event of error message
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                ); 
                console.log('error', JSON.stringify(error));
            });

        }
    }
}