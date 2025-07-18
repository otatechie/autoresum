// Mock API service with demo data
// Use this while waiting for the real backend

// Mock data
const mockResumes = [
    {
        id: 1,
        title: "Software Developer Resume",
        status: "Complete",
        updated_at: "2023-11-15T14:30:00Z"
    },
    {
        id: 2,
        title: "Marketing Professional CV",
        status: "Draft",
        updated_at: "2023-11-10T09:15:00Z"
    },
    {
        id: 3,
        title: "Data Scientist Resume",
        status: "In Progress",
        updated_at: "2023-12-05T16:45:00Z"
    }
];

const mockTemplates = [
    { id: 1, name: "Professional", thumbnail: "/templates/professional.png" },
    { id: 2, name: "Creative", thumbnail: "/templates/creative.png" },
    { id: 3, name: "Academic", thumbnail: "/templates/academic.png" },
    { id: 4, name: "Modern", thumbnail: "/templates/modern.png" }
];

const mockUser = {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    plan: "premium"
};

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service with methods that return promises like a real API
const mockApiService = {
    // User related endpoints
    login: async (credentials) => {
        await delay(800);
        if (credentials.email === "test@example.com" && credentials.password === "password") {
            localStorage.setItem('token', 'mock-jwt-token');
            return { success: true, user: mockUser };
        }
        throw { response: { status: 401, data: { message: "Invalid credentials" } } };
    },

    register: async (userData) => {
        await delay(1000);
        return { success: true, user: { ...mockUser, ...userData } };
    },

    getUser: async () => {
        await delay(500);
        return mockUser;
    },

    // Resume related endpoints
    getResumes: async () => {
        await delay(700);
        return mockResumes;
    },

    getResumeById: async (id) => {
        await delay(600);
        const resume = mockResumes.find(r => r.id === parseInt(id));
        if (!resume) throw { response: { status: 404, data: { message: "Resume not found" } } };
        return resume;
    },

    createResume: async (resumeData) => {
        await delay(900);
        const newResume = {
            id: mockResumes.length + 1,
            ...resumeData,
            status: "Draft",
            updated_at: new Date().toISOString()
        };
        mockResumes.push(newResume);
        return newResume;
    },

    updateResume: async (id, resumeData) => {
        await delay(800);
        const index = mockResumes.findIndex(r => r.id === parseInt(id));
        if (index === -1) throw { response: { status: 404, data: { message: "Resume not found" } } };

        mockResumes[index] = {
            ...mockResumes[index],
            ...resumeData,
            updated_at: new Date().toISOString()
        };

        return mockResumes[index];
    },

    deleteResume: async (id) => {
        await delay(600);
        const index = mockResumes.findIndex(r => r.id === parseInt(id));
        if (index === -1) throw { response: { status: 404, data: { message: "Resume not found" } } };

        mockResumes.splice(index, 1);
        return { success: true };
    },

    // Templates
    getTemplates: async () => {
        await delay(700);
        return mockTemplates;
    },

    generateResume: async (data) => {
        await delay(1500); // Longer delay to simulate AI processing
        return {
            success: true,
            resumeData: {
                sections: {
                    summary: "Experienced professional with expertise in...",
                    experience: [
                        {
                            title: "Senior Developer",
                            company: "Tech Solutions Inc.",
                            location: "San Francisco, CA",
                            startDate: "2020-01",
                            endDate: "Present",
                            description: "Led development of enterprise applications..."
                        }
                    ],
                    education: [
                        {
                            degree: "Bachelor of Science in Computer Science",
                            school: "University of Technology",
                            location: "Boston, MA",
                            gradYear: "2015"
                        }
                    ]
                }
            }
        };
    },

    // Template download
    downloadTemplate: async (templateId) => {
        await delay(2000); // Simulate download time
        const template = mockTemplates.find(t => t.id === templateId);
        if (!template) {
            throw new Error('Template not found');
        }

        // In a real implementation, this would trigger a file download
        // For now, we'll just simulate success
        return {
            success: true,
            message: `Template ${template.name} downloaded successfully`
        };
    }
};

export default mockApiService; 