// Static data for the Home page sections
// Note: howItWorks icons are rendered in Home.jsx since they use JSX (Lucide components)

export const featureSections = [
    {
        title: 'For People in Need',
        imageSrc:
            'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=1000',
        imageAlt: 'Emergency Assistance',
        imagePosition: 'right',
        features: [
            {
                title: 'Request Emergency Help',
                description:
                    'Easily raise a request for food, medical assistance, or rescue support during emergencies.',
            },
            {
                title: 'Share Your Location',
                description:
                    'Automatically share your location so nearby help can reach you faster.',
            },
            {
                title: 'Track Help Status',
                description:
                    'View real time updates on your request and know when help is on the way.',
            },
            {
                title: 'Receive Verified Support',
                description:
                    'Get connected only with verified volunteers and trusted organizations.',
            },
        ],
    },
    {
        title: 'For Volunteers',
        imageSrc:
            'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1000',
        imageAlt: 'Volunteers Helping',
        imagePosition: 'left',
        features: [
            {
                title: 'View Nearby Requests',
                description: 'See emergency help requests from people near your location.',
            },
            {
                title: 'Accept Help Tasks',
                description: 'Choose requests based on your availability and skills.',
            },
            {
                title: 'Navigate to Affected Areas',
                description: 'Get clear directions to reach people who need help quickly.',
            },
            {
                title: 'Track Your Contribution',
                description: 'Monitor completed tasks and your impact in helping others.',
            },
        ],
    },
    {
        title: 'For NGOs & Relief Organizations',
        imageSrc:
            'https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&q=80&w=1000',
        imageAlt: 'NGO Coordination',
        imagePosition: 'right',
        features: [
            {
                title: 'Monitor Crisis Zones',
                description:
                    'View multiple disaster affected locations on a unified dashboard.',
            },
            {
                title: 'Manage Resources Efficiently',
                description:
                    'Track volunteers, supplies, and relief activities in real time.',
            },
            {
                title: 'Coordinate Volunteer Efforts',
                description:
                    'Assign tasks and manage teams effectively during emergencies.',
            },
            {
                title: 'Measure Relief Impact',
                description: 'Analyze response performance and aid delivery outcomes.',
            },
        ],
    },
];

export const reviews = [
    { quote: 'The platform helped us receive aid faster during floods.', name: 'Melon' },
    { quote: 'Volunteering became easy and organized.', name: 'Hamyd' },
    { quote: 'NGO coordination was smooth and transparent.', name: 'Ayesha' },
    { quote: 'AI integration makes it modern ,AI for social good', name: 'Penguin' },
];
