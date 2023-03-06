@isTest
public with sharing class SalaryTriggerTest {
    @isTest public static void SalaryInsertionTest() {
        List<ID> IdList = new List<ID>();
        List<String> yearlist = new List<String>();
        List<Contact> contactList = new List<Contact>();
        Contact aliContact =  new Contact();
        aliContact.LastName = 'Muhammad Ali';
        aliContact.Type__c ='Employee';
        contactList.add(aliContact);
        Contact zainContact = new Contact();
        zainContact.LastName = 'Zain Saeed';
        zainContact.Type__c ='Employee';
        contactList.add(zainContact);
        Contact shabanContact = new Contact();
        shabanContact.LastName = 'Muhammad Shaban';
        shabanContact.Type__c ='Employee';
        contactList.add(shabanContact);
        // insert contactList;
        List<Salary__c> salaryInsertionList = new List<Salary__c>();
        Salary__c aliSalary = new Salary__c();
        aliSalary.Month__c = 'July';
        aliSalary.Month_Salary__c = 70000;
        aliSalary.Contact__c = aliContact.id;
        aliSalary.Year__c = '2022-2023';
        IdList.add(aliSalary.Contact__c);
        yearlist.add(aliSalary.Year__c);
        salaryInsertionList.add(aliSalary);
        Salary__c zainSalary = new Salary__c();
        zainSalary.Month__c = 'July';
        zainSalary.Month_Salary__c = 120000;
        zainSalary.Contact__c = zainContact.id;
        zainSalary.Year__c = '2023-2024';
        IdList.add(zainSalary.Contact__c);
        yearlist.add(zainSalary.Year__c);
        salaryInsertionList.add(zainSalary);
        Salary__c shabanSalary = new Salary__c();
        shabanSalary.Month__c = 'July';
        shabanSalary.Month_Salary__c = 200000;
        shabanSalary.Contact__c = shabanContact.id;
        shabanSalary.Year__c = '2024-2025';
        IdList.add(shabanSalary.Contact__c);
        yearlist.add(shabanSalary.Year__c);
        salaryInsertionList.add(shabanSalary);
        insert salaryInsertionList;
        List<Salary__c> salariesList = [SELECT Id, Salary_To_Be_Paid__c, Tax__c,Contact__c,Year__c FROM Salary__c WHERE Contact__c In :IdList AND Year__c IN :yearlist  ];
        for(Salary__c salary :salariesList){
            if(salary.Year__c == '2022-2023'){
                system.assertEquals(69000 , salary.Salary_To_Be_Paid__c);
                system.assertEquals(1000 , salary.Tax__c);
            }
            else if(salary.Year__c == '2023-2024'){
                system.assertEquals(115500 , salary.Salary_To_Be_Paid__c);
                system.assertEquals(4500, salary.Tax__c);
            }
            else if(salary.Year__c == '2024-2025'){
                system.assertEquals(185000 , salary.Salary_To_Be_Paid__c);
                system.assertEquals(15000 , salary.Tax__c);
            }
        }
    }
}