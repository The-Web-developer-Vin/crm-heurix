import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'projects' },

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {
        path: 'signed-in-redirect',
        pathMatch: 'full',
        redirectTo: 'projects',
    },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.module'
                    ).then((m) => m.AuthConfirmationRequiredModule),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.module'
                    ).then((m) => m.AuthForgotPasswordModule),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.module'
                    ).then((m) => m.AuthResetPasswordModule),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.module').then(
                        (m) => m.AuthSignInModule
                    ),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.module').then(
                        (m) => m.AuthSignUpModule
                    ),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.module').then(
                        (m) => m.AuthSignOutModule
                    ),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.module'
                    ).then((m) => m.AuthUnlockSessionModule),
            },
        ],
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('app/modules/landing/home/home.module').then(
                        (m) => m.LandingHomeModule
                    ),
            },
        ],
    },

    // Admin routes

    {
        path: '',

        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            // {path: 'example', loadChildren: () => import('app/modules/admin/example/example.module').then(m => m.ExampleModule)},

            {
                path: 'dashboard',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import('app/modules/admin/dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },
            {
                path: 'clients',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import('app/modules/admin/clients/clients.module').then(
                        (m) => m.ClientsModule
                    ),
            },
            {
                path: 'clients/single',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/single-client/single-client.module'
                    ).then((m) => m.SingleClientModule),
            },
            {
                path: 'projects',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import('app/modules/admin/projects/projects.module').then(
                        (m) => m.ProjectsModule
                    ),
            },
            {
                path: 'projects/single',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/single-project/single-project.module'
                    ).then((m) => m.SingleProjectModule),
            },

            {
                path: 'payments',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/latest-payments/latest-payments.module'
                    ).then((m) => m.LatestPaymentsModule),
            },

            {
                path: 'settings',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import('app/modules/admin/settings/settings.module').then(
                        (m) => m.SettingsModule
                    ),
            },

            {
                path: 'reports',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/latest-reports/latest-reports.module'
                    ).then((m) => m.LatestReportsModule),
            },
            {
                path: 'employees',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import('app/modules/admin/users/users.module').then(
                        (m) => m.UsersModule
                    ),
            },
            {
                path: 'employees/single',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/single-employee/single-employee.module'
                    ).then((m) => m.SingleEmployeeModule),
            },
            {
                path: 'invoices',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],

                loadChildren: () =>
                    import(
                        'app/modules/admin/invoice-list/invoice-list.module'
                    ).then((m) => m.InvoiceListModule),
            },
            {
                path: 'invoices/create',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],

                loadChildren: () =>
                    import(
                        'app/modules/admin/create-invoice/create-invoice.module'
                    ).then((m) => m.CreateInvoiceModule),
            },

            {
                path: 'invoice/print',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],

                loadChildren: () =>
                    import(
                        'app/modules/admin/generate-invoice/generate-invoice.module'
                    ).then((m) => m.GenerateInvoiceModule),
            },

            {
                path: 'bidding-reports',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/latest-bidding-report/latest-bidding-report.module'
                    ).then((m) => m.LatestBiddingReportModule),
            },

            {
                path: 'offer-letter/:id',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/letters/offer-letter/offer-letter.module'
                    ).then((m) => m.OfferLetterModule),
            },
            {
                path: 'relieving-letter/:id',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/letters/relieve-letter/relieve-letter.module'
                    ).then((m) => m.RelieveLetterModule),
            },
            {
                path: 'experience-letter/:id',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/letters/experience-letter/experience-letter.module'
                    ).then((m) => m.ExperienceLetterModule),
            },
            {
                path: 'work-reports',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/work-report/work-report.module'
                    ).then((m) => m.WorkReportModule),
            },
            {
                path: 'trainees',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import('app/modules/admin/trainee/trainee.module').then(
                        (m) => m.TraineeModule
                    ),
            },
            {
                path: 'trainees/single',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/single-trainee/single-trainee.module'
                    ).then((m) => m.SingleTraineeModule),
            },
            {
                path: 'trainees/fee',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import('app/modules/admin/print-fee/print-fee.module').then(
                        (m) => m.PrintFeeModule
                    ),
            },
            {
                path: 'trainees/certificate',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/trainee-certificate/trainee-certificate.module'
                    ).then((m) => m.TraineeCertificateModule),
            },
            {
                path: 'google-ads/create',

                loadChildren: () =>
                    import(
                        'app/modules/admin/digital-marketing-requirements/google-ads/google-ads.module'
                    ).then((m) => m.GoogleAdsModule),
            },
            {
                path: 'email-marketing/create',
                loadChildren: () =>
                    import(
                        'app/modules/admin/digital-marketing-requirements/email-marketing/email-marketing.module'
                    ).then((m) => m.EmailMarketingModule),
            },
            {
                path: 'facebook-ads/create',
                loadChildren: () =>
                    import(
                        'app/modules/admin/digital-marketing-requirements/facebook-ads/facebook-ads.module'
                    ).then((m) => m.FacebookAdsModule),
            },
            {
                path: 'seo/create',
                loadChildren: () =>
                    import(
                        'app/modules/admin/digital-marketing-requirements/seo/seo.module'
                    ).then((m) => m.SeoModule),
            },

            {
                path: 'smo/create',
                loadChildren: () =>
                    import(
                        'app/modules/admin/digital-marketing-requirements/smo/smo.module'
                    ).then((m) => m.SmoModule),
            },
            {
                path: 'google-ads',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/requirements-list/google-ads-list/google-ads-list.module'
                    ).then((m) => m.GoogleAdsListModule),
            },
            {
                path: 'email-marketing',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/requirements-list/email-marketing-list/email-marketing-list.module'
                    ).then((m) => m.EmailMarketingListModule),
            },
            {
                path: 'facebook-ads',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/requirements-list/facebook-ads-list/facebook-ads-list.module'
                    ).then((m) => m.FacebookAdsListModule),
            },
            {
                path: 'seo',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/requirements-list/seo-list/seo-list.module'
                    ).then((m) => m.SeoListModule),
            },
            {
                path: 'smo',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/requirements-list/smo-list/smo-list.module'
                    ).then((m) => m.SmoListModule),
            },
            {
                path: 'google-ads/client',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/singel-client-requirements/google-ads-single/google-ads-single.module'
                    ).then((m) => m.GoogleAdsSingleModule),
            },
            {
                path: 'facebook-ads/client',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/singel-client-requirements/facebook-ads-single/facebook-ads-single.module'
                    ).then((m) => m.FacebookAdsSingleModule),
            },
            {
                path: 'email-marketing/client',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/singel-client-requirements/email-marketing-single/email-marketing-single.module'
                    ).then((m) => m.EmailMarketingSingleModule),
            },
            {
                path: 'seo/client',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/singel-client-requirements/seo-single/seo-single.module'
                    ).then((m) => m.SeoSingleModule),
            },
            {
                path: 'smo/client',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/singel-client-requirements/smo-single/smo-single.module'
                    ).then((m) => m.SmoSingleModule),
            },
            {
                path: 'website',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/requirements-list/website-list/website-list.module'
                    ).then((m) => m.WebsiteListModule),
            },
            {
                path: 'website/create',
                loadChildren: () =>
                    import(
                        'app/modules/admin/digital-marketing-requirements/website-design/website-design.module'
                    ).then((m) => m.WebsiteDesignModule),
            },
            {
                path: 'website/client',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/singel-client-requirements/website-design-single/website-design-single.module'
                    ).then((m) => m.WebsiteDesignSingleModule),
            },
            {
                path: 'leads',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/requirements-list/leads-list/leads-list.module'
                    ).then((m) => m.LeadsListModule),
            },
            {
                path: 'leads/create',

                loadChildren: () =>
                    import(
                        'app/modules/admin/digital-marketing-requirements/leads/leads.module'
                    ).then((m) => m.LeadsModule),
            },
            {
                path: 'leads/client',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/singel-client-requirements/leads-single/leads-single.module'
                    ).then((m) => m.LeadsSingleModule),
            },
            {
                path: 'cold-calling',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],

                loadChildren: () =>
                    import(
                        'app/modules/admin/cold-calling/cold-calling.module'
                    ).then((m) => m.ColdCallingModule),
            },
            {
                path: 'cold-calling/client',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],

                loadChildren: () =>
                    import(
                        'app/modules/admin/single-cold-calling/single-cold-calling.module'
                    ).then((m) => m.SingleColdCallingModule),
            },
            {
                path: 'tasks',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],

                loadChildren: () =>
                    import(
                        'app/modules/admin/project-management/project-management.module'
                    ).then((m) => m.ProjectManagementModule),
            },
            {
                path: 'tasks/project',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                loadChildren: () =>
                    import(
                        'app/modules/admin/single-project-tasks/single-project-tasks.module'
                    ).then((m) => m.SingleProjectTasksModule),
            },
            {
                path: 'proposals',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],

                loadChildren: () =>
                    import('app/modules/admin/proposals/proposals.module').then(
                        (m) => m.ProposalsModule
                    ),
            },
            {
                path: 'proposals/create',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],

                loadChildren: () =>
                    import(
                        'app/modules/admin/create-praposal/create-praposal.module'
                    ).then((m) => m.CreatePraposalModule),
            },
            {
                path: 'proposals/view',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],

                loadChildren: () =>
                    import(
                        'app/modules/admin/single-praposal-view/single-praposal-view.module'
                    ).then((m) => m.SinglePraposalViewModule),
            },
        ],
    },
];
