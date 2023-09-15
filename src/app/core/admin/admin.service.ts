import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { applicationUrls } from '../urls';
import { environment } from 'environments/environment';
import { retry } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    token: any;
    constructor(private http: HttpClient) {
        this.token = localStorage.getItem('accessToken');
    }

    // larvel API's
    getCountries(payload: any) {
        return this.http.get<any>(applicationUrls.countries + payload);
    }
    addCountry(data: any) {
        // let options = {
        //     headers: new HttpHeaders({
        //         Authorization: 'Bearer ' + this.token,
        //         Accept: 'application/json',
        //     }),
        // };
        return this.http.post<any>(applicationUrls.addCountry, data);
    }
    updateCountry(data) {
        return this.http.put<any>(applicationUrls.updateCountry, data);
    }
    deleteCountry(data: any) {
        // const options = {
        //     headers: new HttpHeaders({
        //       'Content-Type': 'application/json'
        //     }),
        //     body
        //   }
        return this.http.put<any>(applicationUrls.deleteCountry, data);
    }
    getPaidThrough(payload: any) {
        return this.http.get<any>(applicationUrls.paidthrough + payload);
    }
    addpaidThrough(data: any) {
        return this.http.post<any>(applicationUrls.createpaidthrough, data);
    }
    deletepaidThrough(id: any) {
        // const options = {
        //     headers: new HttpHeaders({
        //       'Content-Type': 'application/json'
        //     }),
        //     body
        //   }
        return this.http.put<any>(applicationUrls.deletepaidthrough, id);
    }
    getHiredIn(payload: any) {
        return this.http.get<any>(applicationUrls.hiredIn + payload);
    }
    addHiredIn(data: any) {
        return this.http.post<any>(applicationUrls.addhiredIn, data);
    }
    updateHiredIn(data) {
        return this.http.put<any>(applicationUrls.hiredIn, data);
    }
    deleteHiredin(id: any) {
        return this.http.put<any>(applicationUrls.deleteHiredIn, id);
    }
    getprojects(payload: any) {
        return this.http.get<any>(applicationUrls.Projects + payload);
    }
    addProjects(data: any) {
        return this.http.post<any>(applicationUrls.createProject, data);
    }
    updateProjects(data) {
        return this.http.put<any>(applicationUrls.createProject, data);
    }

    getclients(payload: any) {
        return this.http.get<any>(applicationUrls.clients + payload);
    }
    getallclients(payload: any) {
        return this.http.get<any>(applicationUrls.allclients + payload);
    }
    addClients(data: any) {
        return this.http.post<any>(applicationUrls.addClient, data);
    }
    updateClients(data) {
        return this.http.put<any>(applicationUrls.updateclient, data);
    }
    getbyClientId(id: any) {
        return this.http.get<any>(applicationUrls.addClient + '/' + id);
    }
    getEmployees(payload: any) {
        return this.http.get<any>(applicationUrls.Employee + payload);
    }
    getWorkingEmployees(payload: any) {
        return this.http.get<any>(applicationUrls.workedEmployee + payload);
    }
    generateofferLetter(payload: any) {
        return this.http.post<any>(applicationUrls.OfferLetter, payload);
    }
    generaterelieving(payload: any) {
        return this.http.post<any>(applicationUrls.relieving, payload);
    }
    generateexpLetter(payload: any) {
        return this.http.post<any>(applicationUrls.expeletter, payload);
    }
    addEmployee(data: any) {
        return this.http.post<any>(applicationUrls.Employee, data);
    }
    editEmployee(data: any) {
        return this.http.put<any>(applicationUrls.updateEmployee, data);
    }
    editEmployees(data: any, id: any) {
        return this.http.put<any>(applicationUrls.Employee + '/' + id, data);
    }
    updateEmployeePassword(data: any) {
        return this.http.put<any>(applicationUrls.updatePassword, data);
    }
    getbyEmployeeId(id: any) {
        return this.http.get<any>(applicationUrls.Employee + '/' + id);
    }
    deleteProject(id: any) {
        return this.http.delete<any>(applicationUrls.deleteProjects + '/' + id);
    }
    getbyProjectId(id: any) {
        return this.http.get<any>(applicationUrls.createProject + '/' + id);
    }
    deleteClinet(id: any) {
        return this.http.put<any>(applicationUrls.deleteclient, id);
    }
    getPayments(payload) {
        return this.http.get<any>(applicationUrls.Allpayments + payload);
    }
    deletePayment(id: any) {
        return this.http.delete<any>(applicationUrls.deletepayment + '/' + id);
    }
    addPayments(data: any) {
        return this.http.post<any>(applicationUrls.payments, data);
    }
    paymentbyIDMilestones(id: any) {
        return this.http.get<any>(applicationUrls.milestones + '/' + id);
    }
    editPayment(data: any, id: any) {
        return this.http.put<any>(applicationUrls.payments + '/' + id, data);
    }
    getStream(payload: any) {
        return this.http.get<any>(applicationUrls.stream + payload);
    }
    createStream(data: any) {
        return this.http.post<any>(applicationUrls.createStream, data);
    }
    updateStream(data: any) {
        return this.http.put<any>(applicationUrls.updateStream, data);
    }
    deleteStream(id: any) {
        return this.http.put<any>(applicationUrls.deleteStream, id);
    }
    getbackentemp() {
        return this.http.get<any>(applicationUrls.backendEmployee);
    }
    getuiuxemp() {
        return this.http.get<any>(applicationUrls.uiuxEmployee);
    }
    getmonthReports(payload: any) {
        return this.http.get<any>(applicationUrls.monthreports + payload);
    }
    getAllreports(payload: any) {
        return this.http.get<any>(applicationUrls.allReports + payload);
    }
    getmanagersmonthReports(id: any) {
        return this.http.get<any>(
            applicationUrls.managermonthreports + '/' + id
        );
    }
    getmanagersReports(id: any) {
        return this.http.get<any>(
            applicationUrls.managermonthreports + '/' + id
        );
    }
    getdashboard(params: any) {
        params = params ? params : '';
        return this.http.get<any>(applicationUrls.dashboard + params);
    }
    getAllManagers() {
        return this.http.get<any>(applicationUrls.getManagers);
    }
    getallMangers() {
        return this.http.get<any>(applicationUrls.getAllManagers);
    }
    addBudgettoProject(data: any) {
        return this.http.post<any>(applicationUrls.addBudget, data);
    }
    // bidding
    getAllbidding(payload: any) {
        return this.http.get<any>(applicationUrls.searchallBiddings + payload);
    }

    createBidding(data: any) {
        return this.http.post<any>(applicationUrls.bidding, data);
    }
    updateBidding(data: any) {
        return this.http.put<any>(applicationUrls.bidding, data);
    }
    deleteBidding(id: any) {
        return this.http.delete<any>(applicationUrls.bidding + '/' + id);
    }
    getDailyUpdates(payload: any) {
        return this.http.get<any>(applicationUrls.dailyUpdateAll + payload);
    }
    createDailyUpdate(data: any) {
        return this.http.post<any>(applicationUrls.dailyUpdate, data);
    }
    updateWorkReport(data: any) {
        return this.http.put<any>(applicationUrls.dailyUpdate, data);
    }
    deleteDailyUpdate(id: any) {
        return this.http.delete<any>(applicationUrls.dailyUpdate + '/' + id);
    }

    get paymentCSV() {
        return environment.excelUrl + 'payments.csv';
    }
    get biddingCSV() {
        return environment.excelUrl + 'bidingReports.csv';
    }

    updateClientStreamStatus(data) {
        return this.http.put<any>(
            applicationUrls.updateClientStreamStatus,
            data
        );
    }

    getNewAllReports(id: any, payload: any) {
        return this.http.get<any>(applicationUrls.newReports + id + payload);
    }
    getBudgetById(id: any) {
        return this.http.get<any>(applicationUrls.budgetData + id);
    }
    addBudget(data: any) {
        return this.http.post<any>(applicationUrls.createBudget, data);
    }
    getDigitalMarketingEmployees() {
        return this.http.get<any>(applicationUrls.digitalEmployees);
    }
    getClientProjects(id: any, params: any) {
        return this.http.get<any>(applicationUrls.clientProjects + id + params);
    }
    getClientPayments(id: any, params: any) {
        return this.http.get<any>(applicationUrls.clientPayments + id + params);
    }
    createCourse(data: any) {
        return this.http.post<any>(applicationUrls.courses, data);
    }
    courseList(payload: any) {
        return this.http.get<any>(applicationUrls.courses + payload);
    }
    getCourseById(id: any) {
        return this.http.get<any>(applicationUrls.courses + '/' + id);
    }
    deleteCourse(id: any) {
        return this.http.delete<any>(applicationUrls.courses + '/' + id);
    }
    updateCourse(data: any) {
        return this.http.put<any>(applicationUrls.courses, data);
    }
    createTrainee(data: any) {
        return this.http.post<any>(applicationUrls.trainee, data);
    }
    editTrainee(data: any) {
        return this.http.put<any>(applicationUrls.trainee, data);
    }
    createMilstone(data: any) {
        return this.http.post<any>(applicationUrls.createTraineeMilstone, data);
    }
    getAllTrainees(payload: any) {
        return this.http.get<any>(applicationUrls.allTrainees + payload);
    }
    traineeGetById(id: any) {
        return this.http.get<any>(applicationUrls.trainee + '/' + id);
    }
    getTraineeCount() {
        return this.http.get<any>(applicationUrls.traineeCount);
    }
    createTraineeTechno(data: any) {
        return this.http.post<any>(applicationUrls.technology, data);
    }
    getTraineeTechnology(payload: any) {
        return this.http.get<any>(applicationUrls.technology + payload);
    }
    deleteCourseTechnology(id: any) {
        return this.http.delete<any>(applicationUrls.technology + '/' + id);
    }
    editCourseTechnology(data: any) {
        return this.http.put<any>(applicationUrls.technology, data);
    }
    getMilstoneByTraineeId(id: any) {
        return this.http.get<any>(applicationUrls.traineeMilstoneById + id);
    }
    editPaymentProject(data: any) {
        return this.http.post<any>(applicationUrls.editPayment, data);
    }
    deletePaymentProject(id: any) {
        return this.http.delete<any>(applicationUrls.deletePayment + '/' + id);
    }
    getMonthlyReports(id: any, data: any) {
        return this.http.get<any>(
            applicationUrls.monthlyReports + '/' + id + data
        );
    }
    createStpooedReason(data: any) {
        return this.http.post<any>(applicationUrls.createStoppedReasons, data);
    }
    updateStoppedReason(data: any) {
        return this.http.put<any>(applicationUrls.updateStoppedReasons, data);
    }
    getAllReasons(payload: any) {
        return this.http.get<any>(applicationUrls.stoppedReasons + payload);
    }
    deleteReason(id: any) {
        return this.http.delete<any>(applicationUrls.deleteReason + '/' + id);
    }
    getBiddingEmployees() {
        return this.http.get<any>(applicationUrls.employeeManagers);
    }
    getPaymentsAllCounts(params: any) {
        params = params ? params : '';
        return this.http.get<any>(applicationUrls.paymentAllCounts + params);
    }
    getMonthlyPayments(payload: any) {
        return this.http.get<any>(
            applicationUrls.monthlyPaymentCounts + payload
        );
    }
    getBiddingCounts(payload: any) {
        return this.http.get<any>(applicationUrls.biddingCounts + payload);
    }
    getTraineeCourses() {
        return this.http.get<any>(applicationUrls.traineeCourses);
    }
    getProjectsCounts(payload: any) {
        return this.http.get<any>(applicationUrls.projectsCounts + payload);
    }
    getEmployeeCounts(payload: any) {
        payload = payload ? payload : '';
        return this.http.get<any>(applicationUrls.employeeCounts + payload);
    }
    getAllTraineeCount(payload: any) {
        payload = payload ? payload : '';
        return this.http.get<any>(applicationUrls.traineeCounts + payload);
    }
    getVerifyOTP(data: any) {
        return this.http.post<any>(applicationUrls.verifyOTP, data);
    }
    getResetPassword(data: any) {
        return this.http.put<any>(applicationUrls.resetPassword, data);
    }
    getTypeBasedCurrency(payload: any) {
        payload = payload ? payload : '';
        return this.http.get<any>(applicationUrls.TypeBasedCurrency + payload);
    }
    getClientsReports(payload: any) {
        payload = payload ? payload : '';
        return this.http.get<any>(applicationUrls.clientReports + payload);
    }
    createFollowUp(data: any) {
        return this.http.post<any>(applicationUrls.createFollowUp, data);
    }
    getFollowUpsList(payload: any) {
        return this.http.get<any>(applicationUrls.followList + payload);
    }

    // google ads
    getGoogleAdsList(pageparams) {
        return this.http.get<any>(
            applicationUrls.googleAds + '/list' + pageparams
        );
    }
    getByAdsId(id: any) {
        return this.http.get<any>(applicationUrls.googleAds + '/get/' + id);
    }
    createGoogleAds(data: any) {
        return this.http.post<any>(
            applicationUrls.googleAds + '/createUpdate',
            data
        );
    }
    deleteGoogleAds(id: any) {
        return this.http.delete<any>(applicationUrls.googleAds + '/' + id);
    }
    // email marketing
    getEmailMarketingList(pageparams) {
        return this.http.get<any>(
            applicationUrls.emailMarketing + '/list' + pageparams
        );
    }
    getByEmailId(id: any) {
        return this.http.get<any>(
            applicationUrls.emailMarketing + '/get/' + id
        );
    }
    createEmailMarketing(data: any) {
        return this.http.post<any>(
            applicationUrls.emailMarketing + '/createUpdate',
            data
        );
    }
    deleteEmailMarketing(id: any) {
        return this.http.delete<any>(applicationUrls.emailMarketing + '/' + id);
    }
    // FacebookAds
    getFacebookAdsList(pageparams) {
        return this.http.get<any>(
            applicationUrls.facebookAds + '/list' + pageparams
        );
    }
    getByFacebookId(id: any) {
        return this.http.get<any>(applicationUrls.facebookAds + '/get/' + id);
    }
    createFacebookAds(data: any) {
        return this.http.post<any>(
            applicationUrls.facebookAds + '/createUpdate',
            data
        );
    }
    deleteFacebookAds(id: any) {
        return this.http.delete<any>(applicationUrls.facebookAds + '/' + id);
    }
    // Seo
    getSeoList(pageparams) {
        return this.http.get<any>(applicationUrls.seo + '/list' + pageparams);
    }
    getBySeoId(id: any) {
        return this.http.get<any>(applicationUrls.seo + '/get/' + id);
    }
    createSeo(data: any) {
        return this.http.post<any>(applicationUrls.seo + '/createUpdate', data);
    }
    deleteSeo(id: any) {
        return this.http.delete<any>(applicationUrls.seo + '/' + id);
    }
    // Smo
    getSmoList(pageparams) {
        return this.http.get<any>(applicationUrls.smo + '/list' + pageparams);
    }
    getBySmoId(id: any) {
        return this.http.get<any>(applicationUrls.smo + '/get/' + id);
    }
    createSmo(data: any) {
        return this.http.post<any>(applicationUrls.smo + '/createUpdate', data);
    }
    deleteSmo(id: any) {
        return this.http.delete<any>(applicationUrls.smo + '/' + id);
    }

    // websiteDesign
    getWebsiteDesignList(pageparams) {
        return this.http.get<any>(
            applicationUrls.websiteDesign + '/list' + pageparams
        );
    }
    getByWebsiteDesign(id: any) {
        return this.http.get<any>(applicationUrls.websiteDesign + '/get/' + id);
    }
    createWebsiteDesign(data: any) {
        return this.http.post<any>(
            applicationUrls.websiteDesign + '/createUpdate',
            data
        );
    }
    deleteWebsiteDesign(id: any) {
        return this.http.delete<any>(applicationUrls.websiteDesign + '/' + id);
    }
    commonUpload(file: any) {
        return this.http.post<any>(
            applicationUrls.websiteDesign + '/commonUpload',
            file
        );
    }

    // leads
    getLeadsList(pageparams) {
        return this.http.get<any>(applicationUrls.leads + '/list' + pageparams);
    }
    getByLeads(id: any) {
        return this.http.get<any>(applicationUrls.leads + '/get/' + id);
    }
    createLeads(data: any) {
        return this.http.post<any>(
            applicationUrls.leads + '/createUpdate',
            data
        );
    }
    temporaryDelete(data: any) {
        return this.http.post<any>(applicationUrls.leads + '/isDeleted', data);
    }

    deleteLeads(id: any) {
        return this.http.delete<any>(applicationUrls.leads + '/' + id);
    }
    getLeadCounts() {
        return this.http.get<any>(applicationUrls.leads + '/getAll/counts');
    }
    getFollowUpLeads(data) {
        return this.http.post<any>(applicationUrls.leads + '/followup', data);
    }
    // coldCalling
    getColdList(pageparams) {
        return this.http.get<any>(
            applicationUrls.coldCalling + '/list' + pageparams
        );
    }
    createColdCalling(data) {
        return this.http.post<any>(
            applicationUrls.coldCalling + '/create',
            data
        );
    }
    updateColdCalling(data) {
        return this.http.post<any>(
            applicationUrls.coldCalling + '/update',
            data
        );
    }
    getByCallId(id: any) {
        return this.http.get<any>(applicationUrls.coldCalling + '/get/' + id);
    }
    getColdFolloeUp(data: any) {
        return this.http.post<any>(
            applicationUrls.coldCalling + '/add/followup',
            data
        );
    }
    getColdCounts() {
        return this.http.get<any>(applicationUrls.coldCalling + '/counts/list');
    }
    deleteColdCalling(id: any) {
        return this.http.delete<any>(applicationUrls.coldCalling + '/' + id);
    }

    getTasksList(pageparams) {
        return this.http.get<any>(
            applicationUrls.tasks + '/projects/list' + pageparams
        );
    }
    createTask(data: any) {
        return this.http.post<any>(
            applicationUrls.tasks + '/createUpdate',
            data
        );
    }
    getTasksEmployees() {
        return this.http.get<any>(applicationUrls.tasks + '/employee/list');
    }
    getTaskStatusList(pageparams) {
        return this.http.get<any>(applicationUrls.tasks + '/list' + pageparams);
    }
    deleteTask(id: any) {
        return this.http.delete<any>(applicationUrls.tasks + '/' + id);
    }
    getTaskById(id: any) {
        return this.http.get<any>(applicationUrls.tasks + '/get/' + id);
    }
    getTasksCounts(id: any) {
        return this.http.get<any>(
            applicationUrls.tasks + '/getAll/counts' + '/' + id
        );
    }
    getProjectTasksCount() {
        return this.http.get<any>(applicationUrls.tasks + '/proCount/list');
    }
    getCityList() {
        return this.http.get<any>(applicationUrls.invoice + '/city/list');
    }

    // invoices
    getInvoiceList(pageparams) {
        return this.http.get<any>(
            applicationUrls.invoice + '/list' + pageparams
        );
    }
    createInvoice(data: any) {
        return this.http.post<any>(
            applicationUrls.invoice + '/createupdate',
            data
        );
    }
    getByInvoiceId(id: any) {
        return this.http.get<any>(applicationUrls.invoice + '/get/' + id);
    }
    sendEmail(data: any) {
        return this.http.post<any>(applicationUrls.invoice + '/sendMail', data);
    }

    // proposals
    getProposalList(pageparams) {
        return this.http.get<any>(
            applicationUrls.proposals + '/list' + pageparams
        );
    }
    createProposal(data: any) {
        return this.http.post<any>(
            applicationUrls.proposals + '/createupdate',
            data
        );
    }
    getByProposalId(id: any) {
        return this.http.get<any>(applicationUrls.proposals + '/get/' + id);
    }
    signatureUpdate(data: any) {
        return this.http.post<any>(
            applicationUrls.proposals + '/updateSign',
            data
        );
    }
}
