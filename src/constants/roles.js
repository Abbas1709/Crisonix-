// Shared roles definition used across Login, CreateAccount, and RoleSelect
export const ROLES = [
    {
        title: 'Affected User',
        displayTitle: 'User',
        description:
            'Enables individuals to report crisis incidents, request assistance, and access real-time alerts and information.',
        id: 'affected-user',
    },
    {
        title: 'Volunteer',
        displayTitle: 'Volunteer',
        description:
            'Allows users to participate in crisis response activities by supporting rescue, relief, and coordination operations.',
        id: 'volunteer',
    },
    {
        title: 'NGO / Organisation',
        displayTitle: 'NGO',
        description:
            'Designed for registered organizations to coordinate resources, manage volunteers, and oversee crisis response operations at an organizational level.',
        id: 'ngo',
    },
];
