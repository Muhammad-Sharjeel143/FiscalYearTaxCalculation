trigger SalaryTrigger on Salary__c (before insert) {
    if(trigger.isInsert && trigger.isBefore){
        SalaryTriggerHandler.calculateTax(trigger.new);
    }
}