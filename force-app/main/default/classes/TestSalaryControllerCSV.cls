public with sharing class TestSalaryControllerCSV {
    @AuraEnabled(cacheable=true)
    public static List<Salary__c> getSalaryRec() {
        return [SELECT Name, Month__c ,Contact__c, Year__c from Salary__c ];
    }
}