import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        'id': '10000',
        'title': 'Applications',
        'translate': 'NAV.APPLICATIONS',
        'type': 'group',
        'children': [
            {
                'id': '10100',
                'title': 'Campaigns',
                'translate': null,
                'type': 'item',
                'icon': 'receipt',
                'children': [],
                'url': 'apps/campaigns',
                'badge': null
            },
            {
                'id': '10200',
                'title': 'Monitoring',
                'translate': null,
                'type': 'collapsable',
                'icon': 'bar_chart',
                'children': [
                    {
                        'id': '10201',
                        'title': 'Campaign Summary',
                        'translate': 'NAV.CAMPAIGN.TITLE',
                        'type': 'item',
                        'icon': null,
                        'url': 'apps/dashboards/campaigns',
                        'badge': null
                    }
                ],
                'url': null,
                'badge': null
            },
            {
                'id': '10300',
                'title': 'Royalty Program',
                'translate': null,
                'type': 'collapsable',
                'icon': 'people',
                'children': [
                    {
                        'id': '10301',
                        'title': 'Promotion',
                        'translate': null,
                        'type': 'item',
                        'icon': null,
                        'url': 'apps/xxx4',
                        'badge': null
                    },
                    {
                        'id': '10302',
                        'title': 'Reward',
                        'translate': null,
                        'type': 'item',
                        'icon': null,
                        'url': 'apps/xxx3',
                        'badge': null
                    },
                    {
                        'id': '10303',
                        'title': 'Automation',
                        'translate': null,
                        'type': 'item',
                        'icon': null,
                        'url': 'apps/xxx2',
                        'badge': null
                    },
                    {
                        'id': '10304',
                        'title': 'Redeem',
                        'translate': null,
                        'type': 'item',
                        'icon': null,
                        'url': 'apps/xxx',
                        'badge': null
                    }
                ],
                'url': null,
                'badge': null
            },
            {
                'id': '10400',
                'title': 'Consumers',
                'translate': 'NAV.CONSUMER.TITLE',
                'type': 'item',
                'icon': 'people',
                'children': null,
                'url': 'apps/consumers',
                'badge': null
            }
        ]
    },
    {
        id: '20000',
        title: 'Configurations',
        translate: 'NAV.CONFIGURATIONS',
        type: 'group',
        children: []
    }
];
