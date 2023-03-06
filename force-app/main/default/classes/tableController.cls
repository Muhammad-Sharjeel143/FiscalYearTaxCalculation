public with sharing class tableController {
    @AuraEnabled (cacheable=true)
    public static List<Contact> fetchContacts(){
        return [SELECT Id, Name, Email, Phone, LeadSource, AccountId
                FROM Contact
                LIMIT 2000];
    }
}



// public with sharing class tableController {
//     @AuraEnabled(cacheable=true)
//     public static List<Account> getAccounts() {
//         return [SELECT Id, Name, AnnualRevenue, Industry, Phone from Account];
//     }
// }