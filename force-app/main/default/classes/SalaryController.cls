public with sharing class SalaryController {
    @AuraEnabled  (cacheable = true)
    public Static List<Salary__c> getSalary(String month) {
        return
        [
            SELECT Month__c,Month_Salary__c, Tax__c, Year__c,Salary_To_Be_Paid__c, Contact__r.Name,Contact__r.CNIC__c 
            FROM Salary__c
            WHERE  Month__c =:month
        ];
    }
    @AuraEnabled  (cacheable = true)
    public Static List<Salary__c> getSalaryRecord() {
        return
        [
            SELECT Contact__r.Name,Contact__r.CNIC__c,Month__c,Month_Salary__c,Salary_To_Be_Paid__c, Tax__c, Year__c
            FROM Salary__c
        ];
    }
    @AuraEnabled
    public static void insertSalary(List<Salary__c> newSalaries){
        List<Salary__c> newSalaryInsertionList = new List<Salary__c>();
        try{
            for(Salary__c salary :newSalaries){
                newSalaryInsertionList.add(salary);
            }
            insert newSalaryInsertionList;
        }
        catch(Exception ex) {
            throw new AuraHandledException('All Required fields must be inserted');
        }
    }
    @AuraEnabled  (cacheable = true)
    public Static List<Salary__c> getEmployeeRecord(ID contactID, String year ) {
        return [
            SELECT Month__c,Month_Salary__c, Tax__c, Year__c, Salary_To_Be_Paid__c, Contact__c, Contact__r.Name,Contact__r.CNIC__c 
            FROM Salary__c 
            WHERE Contact__c =:contactID 
            AND Year__c =:year  
        ];
    }
}