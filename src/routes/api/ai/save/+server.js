import { json } from '@sveltejs/kit';

// Mock data for conversation storage
let conversations = new Map();

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    try {
        const { title, messages } = await request.json();

        if (!title || !messages) {
            return json(
                { error: 'Title and messages are required' },
                { status: 400 }
            );
        }

        // Generate a new conversation ID
        const id = Date.now();
        
        const conversation = {
            id,
            title,
            preview: messages.length > 0 ? messages[0].content.substring(0, 100) + '...' : 'New conversation',
            timestamp: 'Just now',
            messageCount: messages.length,
            lastUpdated: new Date().toISOString(),
            messages: messages.map((msg, index) => ({
                id: index + 1,
                type: msg.type,
                content: msg.content,
                timestamp: new Date(Date.now() - (messages.length - index) * 60000)
            }))
        };

        conversations.set(id, conversation);

        return json({ 
            success: true, 
            conversationId: id,
            message: 'Conversation saved successfully'
        });
    } catch (error) {
        console.error('Error saving conversation:', error);
        return json(
            { error: 'Failed to save conversation' },
            { status: 500 }
        );
    }
}