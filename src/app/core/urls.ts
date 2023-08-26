import { environment } from '../../environments/environment';

class ApplicationURLs {
    serverUrl = environment.apiUrl;
    get invoice() {
        return this.serverUrl + 'invoice/createUpdate';
    }
    get getLast() {
        return this.serverUrl + 'invoice/getLast';
    }
    get allInvoice() {
        return this.serverUrl + 'invoice/getusers/getAll';
    }
    get invoiceById() {
        return this.serverUrl + 'invoice';
    }

    // Larvel API's
    serveUrl = environment.apiUrl;

    get countries() {
        return this.serveUrl + 'countries';
    }
    get addCountry() {
        return this.serveUrl + 'countries';
    }
    get updateCountry() {
        return this.serveUrl + 'countries';
    }
    get deleteCountry() {
        return this.serveUrl + 'countries/update_field';
    }
    get paidthrough() {
        return this.serveUrl + 'paidthrough';
    }
    get createpaidthrough() {
        return this.serveUrl + 'paidthrough';
    }
    get deletepaidthrough() {
        return this.serveUrl + 'paidThrough/update_field';
    }
    get hiredIn() {
        return this.serveUrl + 'hired';
    }
    get addhiredIn() {
        return this.serveUrl + 'hired';
    }
    // get updateHired() {
    //     return this.serveUrl + 'country/update';
    // }
    get deleteHiredIn() {
        return this.serveUrl + 'hired/update_field';
    }
    get Projects() {
        return this.serveUrl + 'project';
    }
    get createProject() {
        return this.serveUrl + 'project';
    }
    // get Projects(){
    //     return this.serveUrl + 'projects';
    // }
    get clients() {
        return this.serveUrl + 'client';
    }
    get allclients() {
        return this.serveUrl + 'client/getAll/clients';
    }
    get dailyUpdateAll() {
        return this.serveUrl + 'dailyUpdate/get/searchAll';
    }
    get dailyUpdate() {
        return this.serveUrl + 'dailyUpdate';
    }
    get Employee() {
        return this.serveUrl + 'employee';
    }
    get workedEmployee() {
        return this.serveUrl + 'employee/working/employees';
    }
    get OfferLetter() {
        return this.serveUrl + 'employee/sendOffer/employeeId';
    }
    get relieving() {
        return this.serveUrl + 'employee/sendRelieving/employeeId';
    }
    get expeletter() {
        return this.serveUrl + 'employee/sendExperience/employeeId';
    }
    get updatePassword() {
        return this.serveUrl + 'employee/update/password';
    }
    get updateEmployee() {
        return this.serveUrl + 'employee/update_employee';
    }
    get deleteProjects() {
        return this.serveUrl + 'project';
    }
    get addClient() {
        return this.serveUrl + 'client';
    }
    get updateclient() {
        return this.serveUrl + 'client';
    }
    get deleteclient() {
        return this.serveUrl + 'client/update_field';
    }
    get Allpayments() {
        return this.serveUrl + 'payment';
    }
    get deletepayment() {
        return this.serveUrl + 'payment';
    }
    get payments() {
        return this.serveUrl + 'payment';
    }
    get milestones() {
        return this.serveUrl + 'payment/get';
    }
    get getPayments() {
        return this.serveUrl + 'get-payments';
    }

    //stream
    get stream() {
        return this.serveUrl + 'streams';
    }
    get createStream() {
        return this.serveUrl + 'streams';
    }
    get updateStream() {
        return this.serveUrl + 'streams';
    }
    get deleteStream() {
        return this.serveUrl + 'streams/update_field';
    }
    get backendEmployee() {
        // return this.serveUrl + 'backend-employee';
        return this.serveUrl + 'employee/backend/emp';
    }
    get uiuxEmployee() {
        // return this.serveUrl + 'ui-ux-employee';
        return this.serveUrl + 'employee/ui/ux/emp';
    }
    get monthreports() {
        return this.serveUrl + 'month-report';
    }
    get allReports() {
        return this.serveUrl + 'payment/get_reports';
    }
    get managermonthreports() {
        return this.serveUrl + 'manager-month-stream-report';
    }
    get managerreports() {
        return this.serveUrl + 'manager-month-stream-report';
    }
    get dashboard() {
        return this.serveUrl + 'employee/dashboard/count';
    }
    get getManagers() {
        return this.serveUrl + 'manager';
    }
    get getAllManagers() {
        return this.serveUrl + 'payment/get/managers';
    }
    get addBudget() {
        return this.serveUrl + 'project/update_budget';
    }
    get searchallBiddings() {
        return this.serveUrl + 'biding/get/searchAll';
    }
    get bidding() {
        return this.serveUrl + 'biding';
    }
    get updateClientStreamStatus() {
        return this.serveUrl + 'client/';
    }

    get newReports() {
        return this.serveUrl + 'payment/get/managers_data/';
    }
    get budgetData() {
        return this.serveUrl + 'budget/';
    }
    get createBudget() {
        return this.serveUrl + 'budget/create';
    }
    get digitalEmployees() {
        return this.serveUrl + 'employee/digital/marketing';
    }
    get clientProjects() {
        return this.serveUrl + 'client/payment/';
    }
    get clientPayments() {
        return this.serveUrl + 'project/payment/';
    }

    get courses() {
        return this.serveUrl + 'course';
    }
    get trainee() {
        return this.serveUrl + 'trainee';
    }
    get allTrainees() {
        return this.serveUrl + 'trainee/trainee/list';
    }

    get traineeCount() {
        return this.serveUrl + 'trainee/get/count';
    }
    get technology() {
        return this.serveUrl + 'technology';
    }
    get createTraineeMilstone() {
        return this.serveUrl + 'trainee/createMile';
    }
    get traineeMilstoneById() {
        return this.serveUrl + 'trainee/id/';
    }
    get editPayment() {
        return this.serveUrl + 'payment/updateMilestone';
    }
    get deletePayment() {
        return this.serveUrl + 'payment/delMile';
    }
    get monthlyReports() {
        return this.serveUrl + 'project/reports/list';
    }
    get createStoppedReasons() {
        return this.serveUrl + 'reason/create';
    }
    get updateStoppedReasons() {
        return this.serveUrl + 'reason/update';
    }
    get stoppedReasons() {
        return this.serveUrl + 'reason/search/all';
    }
    get deleteReason() {
        return this.serveUrl + 'reason';
    }
    get employeeManagers() {
        return this.serveUrl + 'employee/biding/emp';
    }
    get biddingReportsList() {
        return this.serveUrl + '';
    }

    get paymentAllCounts() {
        return this.serveUrl + 'payment/getall/count';
    }
    get monthlyPaymentCounts() {
        return this.serveUrl + 'payment/month/count';
    }
    get biddingCounts() {
        return this.serveUrl + 'biding/count/list';
    }
    get traineeCourses() {
        return this.serveUrl + 'course/halfday/fullday';
    }
    get projectsCounts() {
        return this.serveUrl + 'project/all/counts';
    }
    get employeeCounts() {
        return this.serveUrl + 'employee/emp/count';
    }
    get traineeCounts() {
        return this.serveUrl + 'trainee/count/trainee';
    }
    get verifyOTP() {
        return this.serveUrl + 'employee/verify/otp';
    }
    get resetPassword() {
        return this.serveUrl + 'employee/admin/password';
    }
    get TypeBasedCurrency() {
        return this.serveUrl + 'project/currency/list';
    }
    get clientReports() {
        return this.serveUrl + 'project/client/reports';
    }
    get createFollowUp() {
        return this.serveUrl + 'payment/followUp';
    }
    get followList() {
        return this.serveUrl + 'payment/follow/list';
    }
    get googleAds() {
        return this.serveUrl + 'googleAds';
    }
    get emailMarketing() {
        return this.serveUrl + 'emailMarketing';
    }
    get facebookAds() {
        return this.serveUrl + 'facebookAds';
    }
    get seo() {
        return this.serveUrl + 'seo';
    }
    get smo() {
        return this.serveUrl + 'smo';
    }
    get websiteDesign() {
        return this.serveUrl + 'websiteDesign';
    }
    get leads() {
        return this.serveUrl + 'leads';
    }
   
}
export const applicationUrls = new ApplicationURLs();
