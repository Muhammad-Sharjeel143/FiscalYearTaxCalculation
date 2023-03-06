public with sharing class SalaryTriggerHelper {
    public static void calculateIncomeTax(List<Salary__c> newSalaries) {
        List<ID> contactIds  = new List<ID>(); //list for to get ids of new salary to match it with contact id
        List<String> yearList = new List<String>();
        Map<Id, String> mapId = new Map<Id, String>();
        // Map<Id, List<Salary__c>> mapId = new Map<Id, List<Salary__c>>();

        integer counterForMonth = 0; //counter of month list
        double exceedingSalaryOfMonths; 
        double annualSalaryOfMonths;
        integer remainingNumberOfMonth = 12; //to multiply the annular salary with remaining months
        double paidSalaryForMonth;
        double taxOnSalary;
        double sumOfYearSalaries = 0; 
        double totalSumOfSalaries = 0; //total sum of salaries of fiscal year
        double sumOfPreviousTaxs = 0;
        // for(Id salaryid :newSalaries.keyset()){
            for(Salary__c salary :newSalaries){ // loop on new salary
                mapId.put(salary.Contact__c, salary.Year__c);
                // if(salary.Contact__c !=null&& mapId.get(salary.Contact__c)==null){
                //     mapId.put(salary.Contact__c,new List<Salary__c>());    
                // }
                // mapId.get(salary.Contact__c).add(salary);
                // contactIds.add(salary.Contact__c);
                // yearList.add(salary.Year__c);
        }
    // Map<Id, Double> sumMap = new Map<Id, Double>();
        List<Salary__c> fiscalYearsData = [SELECT Id,Month__c,Paid_Salary__c ,Month_Salary__c,Contact__c,Tax__c, Year__c FROM Salary__c WHERE Contact__c In :mapId.keyset() AND Year__c In :mapId.values() ];// salaries July - June 
        List<Contact> contactNameList = [SELECT Id, Name FROM Contact WHERE Id In: mapId.keyset()]; //Query the name of contacts to compare it with lookup contactId
        //Map<Id, Salary__c> mapSalary = new Map<Id, Salary__c>([SELECT Id,Month__c,Paid_Salary__c ,Month_Salary__c,Contact__c,Tax__c, Year__c FROM Salary__c WHERE Contact__c In :contactIds AND Year__c In :yearList]);
        // Map<Id, List<Salary__c>> mapSalary = new Map<Id, List<Salary__c>>();
        List<String> listOfMonth = new List<String>{'July', 'August', 'September', 'October', 'November','December','January','February','March','April', 'May','June'};
        for(Contact contact :contactNameList ){ // loop on list of contacts
        //     if(contact.Id !=null&& mapId.get(contact.id) ==null){
        //         sumMap.put(contact.id,sumOfYearSalaries);    
        //      // }
        //      // mapId.get(salary.Contact__c).add(salary);
        //  }
            for(Salary__c fiscalYearSalary :fiscalYearsData){
               // mapSalary.put(fiscalYearSalary.Contact__c,new List<Salary__c>(fiscalYearSalary)); 
                if(fiscalYearSalary.Contact__c == contact.Id){ //if statement to check whether the id of contact and salary are same or not
                    sumOfYearSalaries += fiscalYearSalary.Month_Salary__c; // sum of previous paid salaries
                    sumOfPreviousTaxs += fiscalYearSalary.Tax__c;
                    //sumMap.put(fiscalYearSalary.Contact__c, sumOfYearSalaries);
                }
                // if(fiscalYearSalary.Contact__c !=null&& mapId.get(fiscalYearSalary.Contact__c) ==null){
                //        sumMap.put(fiscalYearSalary.Contact__c,sumOfYearSalaries);    
                //     // }
                // //     // mapId.get(salary.Contact__c).add(salary);
                // }
            }
                // sumMap.get(fiscalYearSalary.Contact__c);
        }
//        for(Salary__c salary :mapSalary){

  //      }
        // sumOfYearSalaries+= mapSalary.get()
        //totalSumOfSalaries = sumOfYearSalaries;
        for(String month :listOfMonth){
            //Salary__c monthSalary1 = salariesByMonth.get(month);
            //System.debug(monthSalary1);
            for(Salary__c monthSalary :newSalaries){
                //Salary__c mapping = mapSalary.get(monthSalary.Contact__c);
                // monthSalary = salariesByMonth.get(month);
            // double paidSalary = salariesByMonth.get(month).Paid_Salary__c;
            // double taxOnPayableSalary = salariesByMonth.get(month).Tax__c;
            if(month == monthSalary.Month__c){
                // double sumOfMap = sumMap.get(monthSalary.Contact__c);
                annualSalaryOfMonths = (monthSalary.Month_Salary__c*remainingNumberOfMonth)+sumOfYearSalaries; //caculate the annualSalary for All remaining months and will add previous paid salraies sum if there is
                if(annualSalaryOfMonths <= 600000){ //this will check whether the annual salary is greater than or equals to 600000
                    monthSalary.Paid_Salary__c = monthSalary.Month_Salary__c;
                    monthSalary.Tax__c = 0;
                }
                if(annualSalaryOfMonths > 600000 && annualSalaryOfMonths <= 1200000){ //this will check whether the annual salary is greater than 600000 and less than equals to 120000
                    exceedingSalaryOfMonths = annualSalaryOfMonths - 600000; // this will subtract 600000 from total annual salary of months
                    taxOnSalary = (exceedingSalaryOfMonths * 5)/100; //to calculate tax of 5 percent on exceeding salary
                    taxOnSalary -= sumOfPreviousTaxs; 
                    monthSalary.Tax__c = (taxOnSalary/remainingNumberOfMonth);  
                    paidSalaryForMonth = monthSalary.Month_Salary__c - monthSalary.Tax__c; //paid salary of that specific month will be month of that salary minus tax
                    monthSalary.Paid_Salary__c = paidSalaryForMonth;
                }
                if(annualSalaryOfMonths>1200000 && annualSalaryOfMonths<= 1800000){ //this will check whether the annual salary is greater than 1200000 and less than equals to 1800000
                    double fixedTaxOnTenPercent= 30000; //fixed tax of 30000 on 10 percent 
                    exceedingSalaryOfMonths = annualSalaryOfMonths - 1200000; // this will subtract 1200000 from total annual salary of months
                    taxOnSalary = (exceedingSalaryOfMonths * 10)/100 + fixedTaxOnTenPercent; //to calculate tax of 10 percent on exceeding salary
                    taxOnSalary -= sumOfPreviousTaxs; 
                    monthSalary.Tax__c = (taxOnSalary/remainingNumberOfMonth);
                    paidSalaryForMonth = monthSalary.Month_Salary__c - monthSalary.Tax__c;  //paid salary of that specific month will be month of that salary minus tax
                    monthSalary.Paid_Salary__c = paidSalaryForMonth;
                }
                if(annualSalaryOfMonths>1800000 && annualSalaryOfMonths<= 2500000){ //this will check whether the annual salary is greater than 1800000 and less than equals to 2500000
                    double fixTaxOnFifteenPercent = 90000; //fixed tax of 90000 on 15 percent 
                    exceedingSalaryOfMonths =  annualSalaryOfMonths - 1800000; // this will subtract 1800000 from total annual salary of months
                    taxOnSalary = (exceedingSalaryOfMonths * 15)/100 + fixTaxOnFifteenPercent; //to calculate tax of 15 percent on exceeding salary
                    taxOnSalary -= sumOfPreviousTaxs;
                    monthSalary.Tax__c = (taxOnSalary/remainingNumberOfMonth);
                    paidSalaryForMonth = monthSalary.Month_Salary__c - monthSalary.Tax__c; //paid salary of that specific month will be month of that salary minus tax
                    monthSalary.Paid_Salary__c = paidSalaryForMonth;
                }
            }
            
        }
        remainingNumberOfMonth--;
    }
    // Map<contactId, Map<2022-2023, (salry 1, salary 2)>> mapSalary = new Map<String, Map<Id, Salary_c>>();
    // List<Contact> contacts = new List<Contact>();
    // for(Salary soemSalary :newSalaries) {
    //     Map<String, List<Salary__c>> salariesWithYear = mapSalary.get(soemSalary.ContactId);
    //             List<Salary__c> salariesForThisYear = salariesWithYear.get(soemSalary.Year);
    // }
    }
}