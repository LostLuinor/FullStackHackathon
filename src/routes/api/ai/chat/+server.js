import { json } from '@sveltejs/kit';
import OpenAI from 'openai';

// You can replace this with any AI service - OpenAI, Anthropic, Cohere, etc.
// For demo purposes, I'll show multiple options

// Option 1: OpenAI (requires API key)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
});

// Option 2: Free alternatives (no API key needed)
// You can use Hugging Face, Cohere free tier, or other services

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    try {
        const { message, context, conversationHistory } = await request.json();

        if (!message) {
            return json({ error: 'Message is required' }, { status: 400 });
        }

        // Build conversation context
        let systemPrompt = `You are an AI tutor helping students learn. You are knowledgeable, patient, and encouraging. 
        Always provide clear explanations and examples. Break down complex topics into understandable steps.`;

        // Add lesson context if provided
        if (context?.contextType) {
            const contextPrompts = {
                'explain_topic': 'Focus on providing a clear, detailed explanation of the topic.',
                'practice_questions': 'Generate practice questions and exercises to test understanding.',
                'code_examples': 'Provide practical code examples and programming demonstrations.',
                'real_world': 'Show real-world applications and use cases of the concepts.',
                'study_guide': 'Create an organized study guide or summary.',
                'quiz_prep': 'Help prepare for quizzes and exams with tips and strategies.'
            };
            systemPrompt += ` ${contextPrompts[context.contextType] || ''}`;
        }

        let aiResponse;

        try {
            // Option 1: OpenAI API (preferred if you have API key)
            if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-api-key-here') {
                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...buildConversationHistory(conversationHistory),
                        { role: "user", content: message }
                    ],
                    max_tokens: 500,
                    temperature: 0.7,
                });

                aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
            } 
            // Option 2: Hugging Face API (free alternative)
            else if (process.env.HUGGINGFACE_API_KEY) {
                aiResponse = await callHuggingFaceAPI(message, systemPrompt);
            }
            // Option 3: Local/Mock response (fallback)
            else {
                aiResponse = generateIntelligentMockResponse(message, context);
            }

        } catch (apiError) {
            console.error('AI API Error:', apiError);
            // Fallback to intelligent mock response
            aiResponse = generateIntelligentMockResponse(message, context);
        }

        return json({ 
            message: aiResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return json(
            { error: 'Failed to process your message. Please try again.' }, 
            { status: 500 }
        );
    }
}

// Helper function to build conversation history for API
function buildConversationHistory(history) {
    if (!history || !Array.isArray(history)) return [];
    
    return history
        .filter(msg => msg.type === 'user' || msg.type === 'ai')
        .slice(-10) // Last 10 messages for context
        .map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));
}

// Alternative: Hugging Face API call
async function callHuggingFaceAPI(message, systemPrompt) {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: `${systemPrompt}\n\nStudent: ${message}\nTutor:`,
                    parameters: {
                        max_length: 200,
                        temperature: 0.7
                    }
                }),
            }
        );
        
        const result = await response.json();
        return result[0]?.generated_text || "I'm here to help you learn! Could you please rephrase your question?";
    } catch (error) {
        console.error('Hugging Face API Error:', error);
        throw error;
    }
}

// Enhanced mock response generator (fallback)
function generateIntelligentMockResponse(message, context) {
    const lowerMessage = message.toLowerCase();
    
    // Educational topic detection
    const topics = {
        'javascript': 'JavaScript is a versatile programming language used for web development. Would you like me to explain a specific concept like variables, functions, or asynchronous programming?',
        'python': 'Python is a beginner-friendly programming language great for data science, web development, and automation. What specific Python topic would you like to explore?',
        'machine learning': 'Machine learning involves training algorithms to recognize patterns in data. Key concepts include supervised learning, unsupervised learning, and neural networks. What aspect interests you most?',
        'html': 'HTML (HyperText Markup Language) is the backbone of web pages. It uses tags to structure content. Would you like to learn about specific HTML elements or best practices?',
        'css': 'CSS (Cascading Style Sheets) styles HTML elements. It controls layout, colors, fonts, and responsive design. What CSS topic would you like me to explain?',
        'react': 'React is a JavaScript library for building user interfaces with components. Key concepts include JSX, state, props, and hooks. What React feature would you like to understand better?'
    };

    // Context-specific responses
    if (context?.contextType) {
        const contextResponses = {
            'explain_topic': `Let me break down this topic for you:\n\n**Key Points:**\n1. Understanding the fundamentals\n2. Practical applications\n3. Common use cases\n\nRegarding "${message}", I'd be happy to provide a detailed explanation. What specific aspect would you like me to focus on?`,
            'practice_questions': `Here are some practice questions about "${message}":\n\n**Question 1:** Can you explain the main concept?\n**Question 2:** How would you apply this in a real project?\n**Question 3:** What are the key differences between similar concepts?\n\nTry answering these, and I'll provide feedback!`,
            'code_examples': `Here's a practical example related to "${message}":\n\n\`\`\`javascript\n// Example implementation\nfunction exampleCode() {\n    // This demonstrates the concept\n    console.log("Learning in action!");\n}\n\`\`\`\n\nWould you like me to explain how this code works or show more examples?`,
            'real_world': `"${message}" has many real-world applications:\n\n🌍 **Industry Use Cases:**\n• Web development projects\n• Mobile applications\n• Data analysis\n• Automation systems\n\nWhich application area interests you most?`,
            'study_guide': `**Study Guide: ${message}**\n\n📚 **Key Concepts to Master:**\n1. Fundamental principles\n2. Practical implementation\n3. Best practices\n4. Common pitfalls to avoid\n\n💡 **Study Tips:**\n• Practice with examples\n• Build small projects\n• Join study groups\n\nWhat topic should we focus on first?`,
            'quiz_prep': `**Quiz Preparation: ${message}**\n\n🎯 **Focus Areas:**\n• Core concepts and definitions\n• Practical applications\n• Problem-solving strategies\n\n📝 **Study Strategy:**\n1. Review key concepts\n2. Practice with examples\n3. Take practice quizzes\n\nWhat specific area would you like help with?`
        };
        
        return contextResponses[context.contextType];
    }

    // Topic-specific responses
    for (const [topic, response] of Object.entries(topics)) {
        if (lowerMessage.includes(topic)) {
            return response;
        }
    }

    // Question type detection
    if (lowerMessage.startsWith('what')) {
        return `That's a great "what" question! You're asking for a definition or explanation. Let me help you understand:\n\nBased on "${message}", I can provide you with a comprehensive explanation. The key is to break it down into understandable parts. Would you like me to start with the basics or dive into a specific aspect?`;
    }

    if (lowerMessage.startsWith('how')) {
        return `Excellent "how" question! You're looking for a process or method. Here's how I can help:\n\n**Step-by-step approach:**\n1. Start with the basics\n2. Break down the process\n3. Practice with examples\n4. Apply to real situations\n\nRegarding "${message}", which step would you like me to explain first?`;
    }

    if (lowerMessage.startsWith('why')) {
        return `Great "why" question! You're seeking to understand the reasoning behind concepts. Understanding the "why" is crucial for deep learning.\n\n**Let me explain the reasoning:**\n• Historical context\n• Problem it solves\n• Benefits and advantages\n• Real-world importance\n\nFor "${message}", what specific aspect of the "why" interests you most?`;
    }

    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return `Hello! 👋 I'm excited to help you learn today!\n\n**I can help you with:**\n🎓 Subject explanations\n📝 Practice questions\n💻 Code examples\n🌍 Real-world applications\n📚 Study guides\n🎯 Exam preparation\n\n What would you like to explore?`;
    }

    // Help/assistance requests
    if (lowerMessage.includes('help') || lowerMessage.includes('assist') || lowerMessage.includes('support')) {
        return `I'm here to help! 🤝\n\n**Ways I can assist you:**\n• Explain complex concepts simply\n• Provide step-by-step guidance\n• Generate practice exercises\n• Show practical examples\n• Create study materials\n\nWhat specific topic or subject would you like help with today?`;
    }

    // General fallback response
    return `I understand you're asking about "${message}". As your AI tutor, I'm here to help you learn effectively!\n\n**Let me help by:**\n• Breaking down complex topics\n• Providing clear explanations\n• Offering practical examples\n• Suggesting study strategies\n\nCould you tell me more about what specific aspect you'd like to focus on? This will help me provide the most helpful response for your learning goals.`;
}