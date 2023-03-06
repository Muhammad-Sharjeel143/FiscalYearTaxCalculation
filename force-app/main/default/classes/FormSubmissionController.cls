public with sharing class FormSubmissionController {

//     public static void submitFormData(List<FormData> formDataList) {
//     Database.SaveResult[] results  = Database.insert(formDataList, false);
//         for (Integer i = 0; i < results.size(); i++) {
//             if (!results[i].isSuccess()) {
//                 // Log the error message
//                 System.debug(results[i].getErrors()[0].getMessage());
//             }
//         }
//     }
}
    
// public class FormData {
//     @AuraEnabled
//     public String field1;
//     @AuraEnabled
//     public String field2;
//     // Add more fields as per your requirement
// }
    // public static void mehtod(){}
//     @AuraEnabled
//     public static List<String> submitForms(List<FormData> formDataList) {
//         List<String> errorMessages = new List<String>();
        
//         // Collect data from all the forms
//         List<Salary__c> recordsToInsert = new List<Salary__c>();
//         for (Salary__c formData : formDataList) {
//             Salary__c record = formData.getRecord();
//             // Validate the data
//             if (record.isValid()) {
//                 recordsToInsert.add(record);
//             } else {
//                 errorMessages.add('Form with ID ' + formData.formId + ' has invalid data.');
//             }
//         }
        
//         // If all the forms have valid data, submit the data in a single transaction
//         if (errorMessages.isEmpty()) {
//             try {
//                 insert recordsToInsert;
//             } catch (Exception ex) {
//                 errorMessages.add('An error occurred while submitting the forms: ' + ex.getMessage());
//             }
//         }
        
//         return errorMessages;
//     }
    
//     public class FormData {
//         @AuraEnabled
//         public String formId {get; set;}
//         @AuraEnabled
//         public SObject record {get; set;}
        
//         public FormData(String formId, SObject record) {
//             this.formId = formId;
//             this.record = record;
//         }
//     }
// }