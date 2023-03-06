import { LightningElement ,track} from 'lwc';
export default class ParentComponent extends LightningElement {
    get options() {
        return [
            { label: 'None', value: 'none' },
            { label: 'Create Salaries', value: 'create salaries' },
            { label: 'Monthly Report', value: 'monthly report' },
            { label: 'Annual Employee Report', value: 'annual employee report' },
        ];
    }
    @track selectedOption;
    @track salaryInsertComponent = false;
    @track salaryRecordComponent = false;
    @track employeeRecordComponent = false;
    handleChange(event) {
        this.selectedOption = event.target.value;
        switch (this.selectedOption) {
            case 'none':
                this.salaryInsertComponent = false;
                this.salaryRecordComponent = false;
                this.employeeRecordComponent = false;
            break;
            case 'create salaries':
                this.salaryInsertComponent = true;
                this.salaryRecordComponent = false;
                this.employeeRecordComponent = false;
            break;
            case 'monthly report':
                this.salaryInsertComponent = false;
                this.salaryRecordComponent = true;
                this.employeeRecordComponent = false;
            break;
            case 'annual employee report':
                this.employeeRecordComponent = true;
                this.salaryInsertComponent = false;
                this.salaryRecordComponent = false;
            break;
            default:
                this.salaryInsertComponent = false;
                this.salaryRecordComponent = false;
                this.employeeRecordComponent = false;
            break;
        }
    }
}