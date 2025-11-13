import { json } from '@sveltejs/kit';

// In a real app, you would use a database
// For now, we'll use in-memory storage (this will reset on server restart)
let conversations = [
    {
        id: 1,
        title: "Machine Learning Basics",
        preview: "What is the difference between supervised and unsupervised learning?",
        timestamp: "2 hours ago",
        messageCount: 8,
        lastUpdated: new Date(Date.now() - 7200000).toISOString(),
        messages: [
            {
                id: 1,
                type: 'system',
                content: "Hello! I'm your AI tutor. How can I help you today?",
                timestamp: new Date(Date.now() - 7200000)
            },
            {
                id: 2,
                type: 'user',
                content: "What is machine learning?",
                timestamp: new Date(Date.now() - 7000000)
            },
            {
                id: 3,
                type: 'ai',
                content: "Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task...",
                timestamp: new Date(Date.now() - 6900000)
            }
        ]
    },
    {
        id: 2,
        title: "Python Data Structures",
        preview: "Can you help me understand lists vs dictionaries?",
        timestamp: "1 day ago",
        messageCount: 12,
        lastUpdated: new Date(Date.now() - 86400000).toISOString(),
        messages: [
            {
                id: 1,
                type: 'system',
                content: "Hello! I'm your AI tutor. How can I help you today?",
                timestamp: new Date(Date.now() - 86400000)
            }
        ]
    }
];

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    try {
        // Return conversation history without full message content
        const history = conversations.map(conv => ({
            id: conv.id,
            title: conv.title,
            preview: conv.preview,
            timestamp: conv.timestamp,
            messageCount: conv.messageCount,
            lastUpdated: conv.lastUpdated
        }));

        return json({ 
            history,
            total: conversations.length
        });
    } catch (error) {
        console.error('Error fetching AI history:', error);
        return json(
            { error: 'Failed to fetch conversation history' }, 
            { status: 500 }
        );
    }
}