<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import api from '$lib/api.js';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    let supportData = null;
    let loading = true;
    let error = '';
    let success = '';
    let submitting = false;
    let activeTab = 'faq';
    let expandedFaq = null;

    // Contact form
    let contactForm = {
        name: '',
        email: '',
        subject: '',
        category: 'general',
        priority: 'normal',
        message: '',
        attachments: []
    };

    // Mock support data
    const mockSupportData = {
        faqs: [
            {
                id: 1,
                category: 'Getting Started',
                question: 'How do I create an account?',
                answer: 'Click the "Sign Up" button in the top right corner of the homepage. Fill in your details including name, email, and password. You\'ll receive a verification email to complete the registration process.'
            },
            {
                id: 2,
                category: 'Getting Started',
                question: 'How do I enroll in a course?',
                answer: 'Browse our course catalog, click on the course you\'re interested in, and click the "Enroll Now" button. You can preview course content before enrolling to make sure it\'s right for you.'
            },
            {
                id: 3,
                category: 'Courses',
                question: 'Can I download course videos for offline viewing?',
                answer: 'Premium subscribers can download videos for offline viewing through our mobile app. Downloaded content is available for 30 days and requires periodic internet connection to verify your subscription.'
            },
            {
                id: 4,
                category: 'Courses',
                question: 'How do I track my progress?',
                answer: 'Your progress is automatically tracked as you complete lessons and quizzes. Visit your Dashboard to see detailed progress reports, completion percentages, and time spent learning.'
            },
            {
                id: 5,
                category: 'Technical',
                question: 'What browsers are supported?',
                answer: 'We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend Chrome or Firefox with JavaScript enabled.'
            },
            {
                id: 6,
                category: 'Technical',
                question: 'Why are videos not loading?',
                answer: 'Check your internet connection and try refreshing the page. Clear your browser cache and disable any ad blockers. If problems persist, try switching to a different browser or contact support.'
            },
            {
                id: 7,
                category: 'Account',
                question: 'How do I reset my password?',
                answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
            },
            {
                id: 8,
                category: 'Account',
                question: 'Can I change my email address?',
                answer: 'Yes, go to Settings > Account > Email Address. You\'ll need to verify your new email address before the change takes effect. Your old email will receive a confirmation notification.'
            },
            {
                id: 9,
                category: 'Billing',
                question: 'How do I cancel my subscription?',
                answer: 'Go to Settings > Billing > Manage Subscription and click "Cancel Subscription." You\'ll continue to have access until the end of your current billing period.'
            },
            {
                id: 10,
                category: 'Billing',
                question: 'Can I get a refund?',
                answer: 'We offer a 30-day money-back guarantee for all subscriptions. Contact support within 30 days of purchase for a full refund. Individual course purchases are refundable within 7 days if less than 20% completed.'
            }
        ],
        categories: ['Getting Started', 'Courses', 'Technical', 'Account', 'Billing'],
        quickLinks: [
            { title: 'AI Tutor', description: 'Get instant help from our AI assistant', icon: '🤖', link: '/ai-tutor' },
            { title: 'Video Tutorials', description: 'Watch how-to guides and tutorials', icon: '📹', link: '/tutorials' },
            { title: 'Community Forum', description: 'Connect with other learners', icon: '💬', link: '/community' },
            { title: 'System Status', description: 'Check platform availability', icon: '⚡', link: '/status' }
        ],
        contactInfo: {
            email: 'support@learnplatform.com',
            phone: '+1 (555) 123-4567',
            hours: 'Monday - Friday, 9 AM - 6 PM EST',
            avgResponseTime: '2 hours'
        }
    };

    onMount(async () => {
        await loadSupportData();
    });

    async function loadSupportData() {
        try {
            loading = true;
            // const response = await api.getSupportData();
            // supportData = response.data;
            
            setTimeout(() => {
                supportData = mockSupportData;
                loading = false;
            }, 600);
        } catch (err) {
            error = 'Failed to load support data';
            loading = false;
        }
    }

    async function submitContactForm() {
        if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
            error = 'Please fill in all required fields';
            return;
        }

        try {
            submitting = true;
            error = '';
            success = '';

            // await api.submitSupportTicket(contactForm);
            
            // Simulate API call
            setTimeout(() => {
                success = 'Your support ticket has been submitted successfully! We\'ll get back to you within ' + supportData.contactInfo.avgResponseTime + '.';
                contactForm = {
                    name: '',
                    email: '',
                    subject: '',
                    category: 'general',
                    priority: 'normal',
                    message: '',
                    attachments: []
                };
                submitting = false;
                
                setTimeout(() => {
                    success = '';
                }, 5000);
            }, 1000);

        } catch (err) {
            error = 'Failed to submit support ticket';
            submitting = false;
        }
    }

    function toggleFaq(faqId) {
        expandedFaq = expandedFaq === faqId ? null : faqId;
    }

    function filterFaqsByCategory(category) {
        if (!supportData) return [];
        return supportData.faqs.filter(faq => faq.category === category);
    }

    function handleFileUpload(event) {
        const files = Array.from(event.target.files);
        contactForm.attachments = [...contactForm.attachments, ...files];
    }

    function removeAttachment(index) {
        contactForm.attachments = contactForm.attachments.filter((_, i) => i !== index);
    }

    function goToAiTutor() {
        goto('/ai-tutor');
    }
</script>

<svelte:head>
    <title>Help & Support - Learning Platform</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-green-200/50 p-6 mb-8">
            <div class="text-center">
                <h1 class="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                    🆘 Help & Support
                </h1>
                <p class="text-gray-600 mt-2">Get the help you need to succeed in your learning journey</p>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <button 
                on:click={goToAiTutor}
                class="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
                <div class="text-3xl mb-2">🤖</div>
                <div class="font-semibold">AI Tutor</div>
                <div class="text-sm opacity-90">Get instant help</div>
            </button>
            
            {#if supportData}
                {#each supportData.quickLinks.slice(1) as link}
                    <a href={link.link} class="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-center">
                        <div class="text-3xl mb-2">{link.icon}</div>
                        <div class="font-semibold text-gray-800">{link.title}</div>
                        <div class="text-sm text-gray-600">{link.description}</div>
                    </a>
                {/each}
            {/if}
        </div>

        <!-- Tab Navigation -->
        <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-green-200/50 p-2 mb-8">
            <nav class="flex space-x-2">
                <button on:click={() => activeTab = 'faq'} class="flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 {activeTab === 'faq' ? 'bg-green-500 text-white shadow-md' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}">
                    ❓ FAQs
                </button>
                <button on:click={() => activeTab = 'contact'} class="flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 {activeTab === 'contact' ? 'bg-green-500 text-white shadow-md' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}">
                    📧 Contact Support
                </button>
                <button on:click={() => activeTab = 'resources'} class="flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 {activeTab === 'resources' ? 'bg-green-500 text-white shadow-md' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'}">
                    📚 Resources
                </button>
            </nav>
        </div>

        <!-- Status Messages -->
        {#if error}
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p class="text-red-600 font-medium">⚠️ {error}</p>
            </div>
        {/if}

        {#if success}
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p class="text-green-600 font-medium">✅ {success}</p>
            </div>
        {/if}

        {#if loading}
            <div class="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        {:else if supportData}

            {#if activeTab === 'faq'}
                <!-- FAQs Section -->
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-green-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6">❓ Frequently Asked Questions</h3>
                    
                    <!-- FAQ Categories -->
                    <div class="flex flex-wrap gap-2 mb-6">
                        {#each supportData.categories as category}
                            <button 
                                class="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-full text-sm font-medium transition-colors"
                                on:click={() => {
                                    const element = document.getElementById(`category-${category.replace(/\s+/g, '-').toLowerCase()}`);
                                    element?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                {category}
                            </button>
                        {/each}
                    </div>

                    <!-- FAQ Items by Category -->
                    {#each supportData.categories as category}
                        <div id="category-{category.replace(/\s+/g, '-').toLowerCase()}" class="mb-6">
                            <h4 class="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">{category}</h4>
                            <div class="space-y-3">
                                {#each filterFaqsByCategory(category) as faq}
                                    <div class="border border-gray-200 rounded-lg">
                                        <button 
                                            on:click={() => toggleFaq(faq.id)}
                                            class="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                                        >
                                            <span class="font-medium text-gray-800">{faq.question}</span>
                                            <span class="text-gray-400 transform transition-transform {expandedFaq === faq.id ? 'rotate-180' : ''}">▼</span>
                                        </button>
                                        {#if expandedFaq === faq.id}
                                            <div class="p-4 pt-0 text-gray-600 border-t border-gray-100">
                                                {faq.answer}
                                            </div>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}

            {#if activeTab === 'contact'}
                <!-- Contact Support Section -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Contact Info -->
                    <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-200/50 p-6">
                        <h3 class="text-xl font-bold text-gray-800 mb-6">📞 Contact Information</h3>
                        
                        <div class="space-y-4">
                            <div class="flex items-center space-x-3">
                                <span class="text-blue-500">📧</span>
                                <div>
                                    <div class="font-medium">Email</div>
                                    <div class="text-sm text-gray-600">{supportData.contactInfo.email}</div>
                                </div>
                            </div>
                            
                            <div class="flex items-center space-x-3">
                                <span class="text-blue-500">📱</span>
                                <div>
                                    <div class="font-medium">Phone</div>
                                    <div class="text-sm text-gray-600">{supportData.contactInfo.phone}</div>
                                </div>
                            </div>
                            
                            <div class="flex items-center space-x-3">
                                <span class="text-blue-500">🕒</span>
                                <div>
                                    <div class="font-medium">Business Hours</div>
                                    <div class="text-sm text-gray-600">{supportData.contactInfo.hours}</div>
                                </div>
                            </div>
                            
                            <div class="flex items-center space-x-3">
                                <span class="text-blue-500">⚡</span>
                                <div>
                                    <div class="font-medium">Response Time</div>
                                    <div class="text-sm text-gray-600">Average: {supportData.contactInfo.avgResponseTime}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Form -->
                    <div class="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-green-200/50 p-6">
                        <h3 class="text-xl font-bold text-gray-800 mb-6">📧 Send us a Message</h3>
                        
                        <div class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                    <input type="text" bind:value={contactForm.name} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Your full name" />
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                    <input type="email" bind:value={contactForm.email} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="your@email.com" />
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                                <input type="text" bind:value={contactForm.subject} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Brief description of your issue" />
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select bind:value={contactForm.category} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                                        <option value="general">General Question</option>
                                        <option value="technical">Technical Issue</option>
                                        <option value="billing">Billing & Payment</option>
                                        <option value="course">Course Content</option>
                                        <option value="account">Account Management</option>
                                        <option value="feedback">Feedback & Suggestions</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                    <select bind:value={contactForm.priority} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                                        <option value="low">Low</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                                <textarea bind:value={contactForm.message} rows="5" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Please provide as much detail as possible..."></textarea>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                                <input type="file" multiple on:change={handleFileUpload} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                                {#if contactForm.attachments.length > 0}
                                    <div class="mt-2 space-y-2">
                                        {#each contactForm.attachments as file, index}
                                            <div class="flex items-center justify-between bg-gray-50 rounded p-2">
                                                <span class="text-sm text-gray-600">{file.name}</span>
                                                <button on:click={() => removeAttachment(index)} class="text-red-600 hover:text-red-800 text-sm">Remove</button>
                                            </div>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                            
                            <button 
                                on:click={submitContactForm}
                                disabled={submitting}
                                class="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </div>
                </div>
            {/if}

            {#if activeTab === 'resources'}
                <!-- Resources Section -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-purple-200/50 p-6">
                        <div class="text-center mb-4">
                            <div class="text-4xl mb-2">📖</div>
                            <h4 class="font-bold text-gray-800">User Guide</h4>
                        </div>
                        <p class="text-sm text-gray-600 text-center mb-4">Comprehensive guide to using all platform features</p>
                        <button class="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors">
                            View Guide
                        </button>
                    </div>
                    
                    <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-orange-200/50 p-6">
                        <div class="text-center mb-4">
                            <div class="text-4xl mb-2">🎥</div>
                            <h4 class="font-bold text-gray-800">Video Tutorials</h4>
                        </div>
                        <p class="text-sm text-gray-600 text-center mb-4">Step-by-step video guides for common tasks</p>
                        <button class="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">
                            Watch Videos
                        </button>
                    </div>
                    
                    <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-pink-200/50 p-6">
                        <div class="text-center mb-4">
                            <div class="text-4xl mb-2">💬</div>
                            <h4 class="font-bold text-gray-800">Community Forum</h4>
                        </div>
                        <p class="text-sm text-gray-600 text-center mb-4">Connect with other learners and share experiences</p>
                        <button class="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors">
                            Join Forum
                        </button>
                    </div>
                    
                    <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-200/50 p-6">
                        <div class="text-center mb-4">
                            <div class="text-4xl mb-2">📱</div>
                            <h4 class="font-bold text-gray-800">Mobile App</h4>
                        </div>
                        <p class="text-sm text-gray-600 text-center mb-4">Download our app for learning on the go</p>
                        <button class="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                            Download App
                        </button>
                    </div>
                    
                    <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-cyan-200/50 p-6">
                        <div class="text-center mb-4">
                            <div class="text-4xl mb-2">⚡</div>
                            <h4 class="font-bold text-gray-800">System Status</h4>
                        </div>
                        <p class="text-sm text-gray-600 text-center mb-4">Check current platform status and outages</p>
                        <button class="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                            Check Status
                        </button>
                    </div>
                    
                    <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-emerald-200/50 p-6">
                        <div class="text-center mb-4">
                            <div class="text-4xl mb-2">🔄</div>
                            <h4 class="font-bold text-gray-800">Release Notes</h4>
                        </div>
                        <p class="text-sm text-gray-600 text-center mb-4">Latest platform updates and new features</p>
                        <button class="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors">
                            View Updates
                        </button>
                    </div>
                </div>
            {/if}
        {/if}
    </div>
</div>

<style>
    .backdrop-blur-xl {
        backdrop-filter: blur(20px);
    }
</style>