<script>
    import { onMount } from 'svelte';
    import api from '$lib/api.js';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    let reportData = null;
    let loading = true;
    let error = '';
    let showUploadModal = false;
    let uploadProgress = 0;
    let isUploading = false;

    // Upload form data
    let uploadForm = {
        title: '',
        description: '',
        reportFile: null,
        heatmapLinks: ['', '', ''],
        analysisDate: new Date().toISOString().split('T')[0]
    };

    // Mock data for existing reports
    const mockReportData = {
        currentReport: {
            id: 1,
            title: "Q4 2024 UX Analysis Report",
            description: "Comprehensive user experience analysis covering user behavior patterns, conversion funnels, and interface optimization opportunities. This report includes heatmap analysis from 15,000+ user sessions across desktop and mobile platforms.",
            uploadDate: "2024-11-10",
            analysisDate: "2024-11-05",
            reportUrl: "/uploads/hotjar-q4-2024.pdf",
            heatmapLinks: [
                "https://insights.hotjar.com/sites/3456789/heatmaps/123456",
                "https://insights.hotjar.com/sites/3456789/heatmaps/123457", 
                "https://insights.hotjar.com/sites/3456789/heatmaps/123458"
            ],
            keyFindings: [
                "87% of users scroll below the fold on the homepage",
                "Course cards have 23% higher click-through rate when positioned left",
                "Mobile users spend 45% more time on lesson pages",
                "Search functionality is used by only 12% of visitors"
            ]
        },
        competitorAnalysis: [
            {
                name: "Coursera",
                website: "coursera.org",
                strengths: ["Strong brand recognition", "University partnerships", "Mobile app optimization"],
                weaknesses: ["Complex navigation", "High pricing", "Limited free content"],
                conversionRate: "3.2%",
                avgSessionTime: "8m 34s",
                bounceRate: "45.6%",
                mobileUsage: "62%",
                keyFeatures: ["Certificates", "Peer review", "Discussion forums", "Video lectures"]
            },
            {
                name: "Udemy", 
                website: "udemy.com",
                strengths: ["Affordable pricing", "Wide course variety", "Lifetime access"],
                weaknesses: ["Quality inconsistency", "No accreditation", "Cluttered interface"],
                conversionRate: "4.7%",
                avgSessionTime: "12m 18s", 
                bounceRate: "38.2%",
                mobileUsage: "58%",
                keyFeatures: ["Sales/discounts", "Student reviews", "Q&A sections", "Assignments"]
            },
            {
                name: "Skillshare",
                website: "skillshare.com",
                strengths: ["Creative focus", "Project-based learning", "Community features"],
                weaknesses: ["Limited course depth", "Subscription model only", "Niche audience"],
                conversionRate: "2.8%",
                avgSessionTime: "15m 42s",
                bounceRate: "41.3%", 
                mobileUsage: "71%",
                keyFeatures: ["Creative classes", "Project galleries", "Following system", "Workshops"]
            }
        ],
        previousReports: [
            { id: 2, title: "Q3 2024 Mobile UX Study", date: "2024-08-15", status: "Archived" },
            { id: 3, title: "Homepage Conversion Analysis", date: "2024-07-20", status: "Archived" },
            { id: 4, title: "Course Discovery UX Report", date: "2024-06-10", status: "Archived" }
        ]
    };

    onMount(async () => {
        await loadReports();
    });

    async function loadReports() {
        try {
            loading = true;
            // const response = await api.getHotjarReports();
            // reportData = response.data;
            
            setTimeout(() => {
                reportData = mockReportData;
                loading = false;
            }, 800);
        } catch (err) {
            error = 'Failed to load reports';
            loading = false;
        }
    }

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            uploadForm.reportFile = file;
        } else {
            alert('Please select a PDF file');
            event.target.value = '';
        }
    }

    async function uploadReport() {
        if (!uploadForm.title || !uploadForm.description || !uploadForm.reportFile) {
            alert('Please fill in all required fields and select a PDF file');
            return;
        }

        try {
            isUploading = true;
            uploadProgress = 0;

            const formData = new FormData();
            formData.append('title', uploadForm.title);
            formData.append('description', uploadForm.description);
            formData.append('reportFile', uploadForm.reportFile);
            formData.append('analysisDate', uploadForm.analysisDate);
            formData.append('heatmapLinks', JSON.stringify(uploadForm.heatmapLinks.filter(link => link.trim())));

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                uploadProgress += Math.random() * 15;
                if (uploadProgress >= 90) {
                    clearInterval(progressInterval);
                }
            }, 200);

            // const response = await api.uploadHotjarReport(formData);
            
            // Simulate API call
            setTimeout(() => {
                clearInterval(progressInterval);
                uploadProgress = 100;
                
                setTimeout(() => {
                    isUploading = false;
                    showUploadModal = false;
                    uploadForm = {
                        title: '',
                        description: '',
                        reportFile: null,
                        heatmapLinks: ['', '', ''],
                        analysisDate: new Date().toISOString().split('T')[0]
                    };
                    loadReports(); // Reload to show new report
                }, 500);
            }, 2000);

        } catch (err) {
            error = 'Failed to upload report';
            isUploading = false;
        }
    }

    function addHeatmapLink() {
        uploadForm.heatmapLinks = [...uploadForm.heatmapLinks, ''];
    }

    function removeHeatmapLink(index) {
        uploadForm.heatmapLinks = uploadForm.heatmapLinks.filter((_, i) => i !== index);
    }

    function getCompetitorScore(conversionRate) {
        const rate = parseFloat(conversionRate);
        if (rate >= 4) return { color: 'text-green-600', label: 'Excellent' };
        if (rate >= 3) return { color: 'text-yellow-600', label: 'Good' };
        return { color: 'text-red-600', label: 'Needs Improvement' };
    }
</script>

<svelte:head>
    <title>Hotjar Reports - UX Analysis</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-orange-200/50 p-6 mb-8">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        🔥 Hotjar UX Reports
                    </h1>
                    <p class="text-gray-600 mt-2">User experience analysis and competitor insights</p>
                </div>
                <button on:click={() => showUploadModal = true} class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200">
                    📤 Upload New Report
                </button>
            </div>
        </div>

        {#if loading}
            <div class="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        {:else if error}
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p class="text-red-600 font-medium">⚠️ {error}</p>
            </div>
        {:else if reportData}
            
            <!-- Current Report -->
            {#if reportData.currentReport}
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-orange-200/50 p-6 mb-8">
                    <div class="flex items-start justify-between mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-gray-800">{reportData.currentReport.title}</h3>
                            <p class="text-gray-600 mt-1">Analysis Date: {reportData.currentReport.analysisDate} | Uploaded: {reportData.currentReport.uploadDate}</p>
                        </div>
                        <a href={reportData.currentReport.reportUrl} target="_blank" class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                            📄 View PDF
                        </a>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <!-- Description -->
                        <div class="lg:col-span-2">
                            <h4 class="font-semibold text-gray-700 mb-3">Report Description</h4>
                            <p class="text-gray-600 leading-relaxed mb-6">{reportData.currentReport.description}</p>
                            
                            <h4 class="font-semibold text-gray-700 mb-3">Key Findings</h4>
                            <div class="space-y-2">
                                {#each reportData.currentReport.keyFindings as finding}
                                    <div class="flex items-start space-x-2">
                                        <span class="text-orange-500 mt-1">•</span>
                                        <span class="text-gray-600">{finding}</span>
                                    </div>
                                {/each}
                            </div>
                        </div>
                        
                        <!-- Heatmap Links -->
                        <div>
                            <h4 class="font-semibold text-gray-700 mb-3">Heatmap Links</h4>
                            <div class="space-y-3">
                                {#each reportData.currentReport.heatmapLinks as link, index}
                                    <a href={link} target="_blank" class="block bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-lg p-3 hover:shadow-md transition-all duration-200">
                                        <div class="flex items-center space-x-2">
                                            <span class="text-orange-600">🔥</span>
                                            <span class="text-sm font-medium text-gray-800">Heatmap {index + 1}</span>
                                        </div>
                                        <div class="text-xs text-gray-600 mt-1">Click to view in Hotjar</div>
                                    </a>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Competitor Analysis -->
            <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-red-200/50 p-6 mb-8">
                <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    🏆 Competitor Analysis
                </h3>
                
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-gray-200">
                                <th class="text-left py-3 px-4 font-semibold text-gray-700">Platform</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-700">Conversion Rate</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-700">Avg Session</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-700">Bounce Rate</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-700">Mobile Usage</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-700">Key Features</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each reportData.competitorAnalysis as competitor}
                                <tr class="border-b border-gray-100 hover:bg-gray-50">
                                    <td class="py-4 px-4">
                                        <div>
                                            <div class="font-semibold text-gray-800">{competitor.name}</div>
                                            <div class="text-sm text-gray-600">{competitor.website}</div>
                                        </div>
                                    </td>
                                    <td class="py-4 px-4">
                                        <div class="font-bold {getCompetitorScore(competitor.conversionRate).color}">
                                            {competitor.conversionRate}
                                        </div>
                                        <div class="text-xs {getCompetitorScore(competitor.conversionRate).color}">
                                            {getCompetitorScore(competitor.conversionRate).label}
                                        </div>
                                    </td>
                                    <td class="py-4 px-4 font-medium">{competitor.avgSessionTime}</td>
                                    <td class="py-4 px-4 font-medium">{competitor.bounceRate}</td>
                                    <td class="py-4 px-4 font-medium">{competitor.mobileUsage}</td>
                                    <td class="py-4 px-4">
                                        <div class="flex flex-wrap gap-1">
                                            {#each competitor.keyFeatures.slice(0, 3) as feature}
                                                <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{feature}</span>
                                            {/each}
                                            {#if competitor.keyFeatures.length > 3}
                                                <span class="text-gray-500 text-xs">+{competitor.keyFeatures.length - 3} more</span>
                                            {/if}
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>

                <!-- Detailed Competitor Insights -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {#each reportData.competitorAnalysis as competitor}
                        <div class="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 class="font-bold text-gray-800 mb-3">{competitor.name}</h4>
                            
                            <div class="mb-4">
                                <h5 class="text-sm font-semibold text-green-600 mb-1">Strengths</h5>
                                <div class="space-y-1">
                                    {#each competitor.strengths as strength}
                                        <div class="text-xs text-gray-600">• {strength}</div>
                                    {/each}
                                </div>
                            </div>
                            
                            <div>
                                <h5 class="text-sm font-semibold text-red-600 mb-1">Weaknesses</h5>
                                <div class="space-y-1">
                                    {#each competitor.weaknesses as weakness}
                                        <div class="text-xs text-gray-600">• {weakness}</div>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Previous Reports -->
            {#if reportData.previousReports && reportData.previousReports.length > 0}
                <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6">📚 Previous Reports</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {#each reportData.previousReports as report}
                            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <h4 class="font-semibold text-gray-800">{report.title}</h4>
                                <div class="text-sm text-gray-600 mt-1">{report.date}</div>
                                <div class="mt-2">
                                    <span class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">{report.status}</span>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        {/if}
    </div>
</div>

<!-- Upload Modal -->
{#if showUploadModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 class="text-xl font-bold text-gray-800 mb-6">📤 Upload New UX Report</h3>
            
            {#if isUploading}
                <div class="text-center py-8">
                    <div class="mb-4">
                        <LoadingSpinner />
                    </div>
                    <div class="text-gray-600 mb-2">Uploading report...</div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full transition-all duration-300" style="width: {uploadProgress}%"></div>
                    </div>
                    <div class="text-sm text-gray-500 mt-2">{Math.round(uploadProgress)}%</div>
                </div>
            {:else}
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Report Title*</label>
                        <input type="text" bind:value={uploadForm.title} placeholder="e.g., Q4 2024 UX Analysis Report" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                        <textarea bind:value={uploadForm.description} rows="3" placeholder="Describe the scope and key objectives of this UX analysis..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Analysis Date</label>
                        <input type="date" bind:value={uploadForm.analysisDate} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Upload PDF Report*</label>
                        <input type="file" accept=".pdf" on:change={handleFileSelect} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                        {#if uploadForm.reportFile}
                            <div class="text-sm text-green-600 mt-1">✓ {uploadForm.reportFile.name}</div>
                        {/if}
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Heatmap Links</label>
                        {#each uploadForm.heatmapLinks as link, index}
                            <div class="flex items-center space-x-2 mb-2">
                                <input type="url" bind:value={uploadForm.heatmapLinks[index]} placeholder="https://insights.hotjar.com/..." class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                                {#if uploadForm.heatmapLinks.length > 1}
                                    <button on:click={() => removeHeatmapLink(index)} class="text-red-600 hover:text-red-800">🗑️</button>
                                {/if}
                            </div>
                        {/each}
                        <button on:click={addHeatmapLink} class="text-orange-600 hover:text-orange-800 text-sm">+ Add another heatmap link</button>
                    </div>
                </div>
                
                <div class="flex space-x-4 mt-6">
                    <button on:click={() => showUploadModal = false} class="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600">
                        Cancel
                    </button>
                    <button on:click={uploadReport} class="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-200">
                        Upload Report
                    </button>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .backdrop-blur-xl {
        backdrop-filter: blur(20px);
    }
</style>