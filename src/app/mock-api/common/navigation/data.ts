/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'dashboard',
        link: '/dashboard',
    },
    {
        id: 'clients',
        title: 'Clients',
        type: 'basic',
        icon: 'group',
        link: '/clients',
    },
    {
        id: 'projects',
        title: 'Projects',
        type: 'basic',
        icon: 'assignment',
        link: '/projects',
    },
    {
        id: 'payments',
        title: 'Payments',
        type: 'basic',
        icon: 'credit_card',
        link: '/payments',
    },

    {
        id: 'reports',
        title: 'Reports',
        type: 'basic',
        icon: 'lab_profile',
        link: '/reports',
    },

    {
        id: 'employees',
        title: 'Employees',
        type: 'basic',
        icon: 'supervised_user_circle',
        link: '/employees',
    },
    // {
    //     id: 'trainees',
    //     title: 'Trainees',
    //     type: 'basic',
    //     icon: 'person_add',
    //     link: '/trainees',
    // },
    // {
    //     id: 'biddings',
    //     title: 'Bidding Report',
    //     type: 'basic',
    //     icon: 'monetization_on',
    //     link: '/bidding-reports',
    // },

    // {
    //     id: 'workreport',
    //     title: 'Work Report',
    //     type: 'basic',
    //     icon: 'description',
    //     link: '/work-reports',
    // },
    {
        id: 'digital',
        title: 'Req Forms',
        type: 'collapsable',
        icon: 'list_alt',
        // link : '/courses'
        children: [
            {
                id: 'googleAds',
                title: 'Google Ads',
                type: 'basic',
                //  icon : 'feather:clipboard',
                link: 'google-ads',
            },
            {
                id: 'emailMarketing',
                title: 'Email Marketing',
                type: 'basic',
                //  icon : 'feather:clipboard',
                link: 'email-marketing',
            },
            {
                id: 'facebookAds',
                title: 'Facebook Ads',
                type: 'basic',
                //  icon : 'feather:clipboard',
                link: 'facebook-ads',
            },
            {
                id: 'seo',
                title: 'SEO',
                type: 'basic',
                //  icon : 'feather:clipboard',
                link: 'seo',
            },
            {
                id: 'smo',
                title: 'SMO Organic',
                type: 'basic',
                //  icon : 'feather:clipboard',
                link: 'smo',
            },
            {
                id: 'websiteDesign',
                title: 'Website Design',
                type: 'basic',
                //  icon : 'feather:clipboard',
                link: 'website',
            },
        ],
    },
    {
        id: 'leads',
        title: 'Leads',
        type: 'basic',
        icon: 'leaderboard',
        link: 'leads',
    },
    {
        id: 'settings',
        title: 'Settings',
        type: 'basic',
        icon: 'settings',
        link: '/settings',
    },
    {
        id: 'signout',
        title: 'Sign Out',
        type: 'basic',
        icon: 'logout',
        link: '/sign-out',
    },
];
export const userNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'dashboard',
        link: '/dashboard',
    },
    {
        id: 'clients',
        title: 'Clients',
        type: 'basic',
        icon: 'group',
        link: '/clients',
    },
    {
        id: 'projects',
        title: 'Projects',
        type: 'basic',
        icon: 'assignment',
        link: '/projects',
    },
    {
        id: 'payments',
        title: 'Payments',
        type: 'basic',
        icon: 'credit_card',
        link: '/payments',
    },

    {
        id: 'reports',
        title: 'Reports',
        type: 'basic',
        icon: 'lab_profile',
        link: '/reports',
    },

    // {
    //     id: 'employees',
    //     title: 'Employees',
    //     type: 'basic',
    //     icon: 'supervised_user_circle',
    //     link: '/employees',
    // },
    // {
    //     id: 'trainees',
    //     title: 'Trainees',
    //     type: 'basic',
    //     icon: 'person_add',
    //     link: '/trainees',
    // },
    // {
    //     id: 'biddings',
    //     title: 'Bidding Report',
    //     type: 'basic',
    //     icon: 'monetization_on',
    //     link: '/bidding-reports',
    // },

    // {
    //     id: 'workreport',
    //     title: 'Work Report',
    //     type: 'basic',
    //     icon: 'description',
    //     link: '/work-reports',
    // },
    {
        id: 'digital',
        title: 'Digital Forms',
        type: 'collapsable',
        icon: 'list_alt',
        // link : '/courses'
        children: [
            {
                id: 'googleAds',
                title: 'Google Ads',
                type: 'basic',
                //  icon : 'feather:clipboard',
                link: 'google-ads',
            },
            {
                id: 'emailMarketing',
                title: 'Email Marketing',
                type: 'basic',
                //  icon : 'feather:clipboard',
                link: 'email-marketing',
            },
            {
                id: 'facebookAds',
                title: 'Facebook Ads',
                type: 'basic',
                //  icon : 'feather:clipboard',
                link: 'facebook-ads',
            },
            {
                id: 'seo',
                title: 'SEO',
                type: 'basic',
                //  icon : 'feather:clipboard',
                link: 'seo',
            },
            {
                id: 'smo',
                title: 'SMO Organic',
                type: 'basic',
                //  icon : 'feather:clipboard',
                link: 'smo',
            },
            {
                id: 'websiteDesign',
                title: 'Website Design',
                type: 'basic',
                //  icon : 'feather:clipboard',
                link: 'website',
            },
        ],
    },
    {
        id: 'leads',
        title: 'Leads',
        type: 'basic',
        icon: 'leaderboard',
        link: 'leads',
    },

    {
        id: 'settings',
        title: 'Settings',
        type: 'basic',
        icon: 'settings',
        link: '/settings',
    },
    {
        id: 'signout',
        title: 'Sign Out',
        type: 'basic',
        icon: 'logout',
        link: '/sign-out',
    },
];
export const salesNavigation: FuseNavigationItem[] = [
    // {
    //     id: 'biddings',
    //     title: 'Bidding Report',
    //     type: 'basic',
    //     icon: 'monetization_on',
    //     link: '/bidding-reports',
    // },

    // {
    //     id: 'workreport',
    //     title: 'Work Report',
    //     type: 'basic',
    //     icon: 'description',
    //     link: '/work-reports',
    // },
    {
        id: 'digital',
        title: 'Digital Forms',
        type: 'collapsable',
        icon: 'list_alt',
        // link : '/courses'
        children: [
            {
                id: 'googleAds',
                title: 'Google Ads',
                type: 'basic',
                //  icon : 'feather:clipboard',
                link: 'google-ads',
            },
            {
                id: 'emailMarketing',
                title: 'Email Marketing',
                type: 'basic',
                //  icon : 'feather:clipboard',
                link: 'email-marketing',
            },
            {
                id: 'facebookAds',
                title: 'Facebook Ads',
                type: 'basic',
                //  icon : 'feather:clipboard',
                link: 'facebook-ads',
            },
            {
                id: 'seo',
                title: 'SEO',
                type: 'basic',
                //  icon : 'feather:clipboard',
                link: 'seo',
            },
            {
                id: 'smo',
                title: 'SMO Organic',
                type: 'basic',
                //  icon : 'feather:clipboard',
                link: 'smo',
            },
        ],
    },
    {
        id: 'signout',
        title: 'Sign Out',
        type: 'basic',
        icon: 'logout',
        link: '/sign-out',
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
