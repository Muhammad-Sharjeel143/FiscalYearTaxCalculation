public with sharing class SalaryTriggerHandler {
    public static void calculateTax(List<Salary__c> newSalaries) {
        List<String> listOfMonth = new List<String>{'July', 'August', 'September', 'October', 'November','December','January','February','March','April', 'May','June'};
        Set<Id> contactIds = new Set<Id>();
        Set<String> yearSalaries = new Set<String>();
        for (Salary__c salary :newSalaries) {
            // if (String.isNotBlank(salary.Contact__c)) {
                contactIds.add(salary.Contact__c);
                yearSalaries.add(salary.Year__c);
            // }
        }
        Map<Id, Map<String, List<Salary__c>>> salariesByYearAndContact = new Map<Id, Map<String, List<Salary__c>>>();
        List<Salary__c> salariesQueried = 
        [
            SELECT Id, Contact__c, Month__c, Month_Salary__c, Tax__c, Year__c 
            FROM Salary__c 
            WHERE Contact__c
            IN :contactIds 
            AND Year__c
            IN :yearSalaries
        ];
        List<TaxRanges__mdt> taxRangesMetadata = 
        [
            SELECT Id, Range_From__c, Range_To__c, Percentage__c, Fix_Amount__c, Order_By__c 
            FROM TaxRanges__mdt 
            ORDER BY Order_By__c ASC 
        ];
        Map<Decimal, TaxRanges__mdt> taxRangesByRangeTo = new Map<Decimal, TaxRanges__mdt>();
        for(TaxRanges__mdt income :taxRangesMetadata){
            taxRangesByRangeTo.put(income.Range_To__c, income);
        }
        for (Salary__c salary :salariesQueried) {
            if (salariesByYearAndContact.containsKey(salary.Contact__c)) {
                Map<String, List<Salary__c>> salariesByYear = salariesByYearAndContact.get(salary.Contact__c);
                if (salariesByYear.containsKey(salary.Year__c)) {
                    salariesByYear.get(salary.Year__c).add(salary);
                } 
                else {
                    salariesByYear.put(salary.Year__c, new List<Salary__c>{salary});
                }
            } 
            else {
                Map<String, List<Salary__c>> salariesByYear = new Map<String, List<Salary__c>>();
                salariesByYear.put(salary.Year__c, new List<Salary__c>{salary});
                salariesByYearAndContact.put(salary.Contact__c, salariesByYear);
            }
        }
        for (Salary__c salary :newSalaries) {
            Decimal taxAlreadyPaid = 0;
            Decimal totalSalaryForRemainingMonth = 0;
            Decimal totalSalaryAlreadyPaid = 0;
            Integer numberOfRemainingMonths = 0;
            Integer indexNumber = 0;
            if (salariesByYearAndContact.containsKey(salary.Contact__c)) {
                Map<String, List<Salary__c>> salariesByYear = salariesByYearAndContact.get(salary.Contact__c);
                if (salariesByYear.containsKey(salary.Year__c)) {
                    List<Salary__c> thisYearSalaries = salariesByYear.get(salary.Year__c);
                    for (Salary__c thisYearSalary :thisYearSalaries) {
                        taxAlreadyPaid = taxAlreadyPaid + thisYearSalary.Tax__c;
                        totalSalaryAlreadyPaid = totalSalaryAlreadyPaid + thisYearSalary.Month_Salary__c;
                    }
                } 
            }
            Integer indexOfMonth = listOfMonth.indexOf(salary.Month__c);
            numberOfRemainingMonths = 12 - indexOfMonth;
            totalSalaryForRemainingMonth = numberOfRemainingMonths * salary.Month_Salary__c;
            Decimal totalYearSalary = totalSalaryAlreadyPaid + totalSalaryForRemainingMonth;
            for(Decimal key :taxRangesByRangeTo.keyset()){
                if(totalYearSalary > taxRangesByRangeTo.get(key).Range_From__c && totalYearSalary <= taxRangesByRangeTo.get(key).Range_To__c ){
                    Decimal fixedTax = taxRangesByRangeTo.get(key).Fix_Amount__c;
                    Decimal taxAbleSalary = totalYearSalary - taxRangesByRangeTo.get(key).Range_From__c;
                    Decimal yearlyTax = ((taxAbleSalary /100) * taxRangesByRangeTo.get(key).Percentage__c) + fixedTax;
                    Decimal yearlyTaxToBePaid = yearlyTax - taxAlreadyPaid;
                    Decimal perMonthTaxToBePaid = yearlyTaxToBePaid / numberOfRemainingMonths;
                    salary.Tax__c = perMonthTaxToBePaid;
                    salary.Paid_Salary__c = salary.Month_Salary__c - perMonthTaxToBePaid;
                }
            }
        }
    }
}