<script>
    import { onMount } from 'svelte';
    import api from '$lib/api.js';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    let users = [];
    let filteredUsers = [];
    let loading = true;
    let error = '';
    let searchTerm = '';
    let selectedRole = 'all';
    let selectedStatus = 'all';
    let showAddModal = false;
    let showEditModal = false;
    let editingUser = null;

    // New user form
    let newUser = {
        name: '',
        email: '',
        role: 'student',
        password: ''
    };

    // Mock data
    const mockUsers = [
        { id: 1, name: "Sarah Johnson", email: "sarah@email.com", role: "student", status: "active", joinDate: "2024-11-10", lastLogin: "2024-11-12", courses: 5 },
        { id: 2, name: "Mike Chen", email: "mike@email.com", role: "teacher", status: "active", joinDate: "2024-11-09", lastLogin: "2024-11-11", courses: 8 },
        { id: 3, name: "Emily Davis", email: "emily@email.com", role: "student", status: "inactive", joinDate: "2024-11-08", lastLogin: "2024-11-08", courses: 2 },
        { id: 4, name: "Alex Rodriguez", email: "alex@email.com", role: "teacher", status: "pending", joinDate: "2024-11-07", lastLogin: null, courses: 0 },
        { id: 5, name: "Lisa Brown", email: "lisa@email.com", role: "student", status: "active", joinDate: "2024-11-05", lastLogin: "2024-11-12", courses: 12 },
        { id: 6, name: "David Wilson", email: "david@email.com", role: "teacher", status: "suspended", joinDate: "2024-11-01", lastLogin: "2024-11-06", courses: 3 }
    ];

    onMount(async () => {
        await loadUsers();
    });

    async function loadUsers() {
        try {
            loading = true;
            // const response = await api.getAdminUsers();
            // users = response.data;
            
            setTimeout(() => {
                users = mockUsers;
                filteredUsers = users;
                loading = false;
            }, 800);
        } catch (err) {
            error = 'Failed to load users';
            loading = false;
        }
    }

    function filterUsers() {
        filteredUsers = users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = selectedRole === 'all' || user.role === selectedRole;
            const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
            
            return matchesSearch && matchesRole && matchesStatus;
        });
    }

    $: {
        searchTerm, selectedRole, selectedStatus;
        filterUsers();
    }

    async function addUser() {
        try {
            // await api.createAdminUser(newUser);
            console.log('Adding user:', newUser);
            const newUserId = Math.max(...users.map(u => u.id)) + 1;
            users = [...users, {
                ...newUser,
                id: newUserId,
                status: 'active',
                joinDate: new Date().toISOString().split('T')[0],
                lastLogin: null,
                courses: 0
            }];
            
            newUser = { name: '', email: '', role: 'student', password: '' };
            showAddModal = false;
        } catch (err) {
            error = 'Failed to add user';
        }
    }

    async function updateUser() {
        try {
            // await api.updateAdminUser(editingUser.id, editingUser);
            console.log('Updating user:', editingUser);
            users = users.map(u => u.id === editingUser.id ? editingUser : u);
            showEditModal = false;
            editingUser = null;
        } catch (err) {
            error = 'Failed to update user';
        }
    }

    async function deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                // await api.deleteAdminUser(userId);
                console.log('Deleting user:', userId);
                users = users.filter(u => u.id !== userId);
            } catch (err) {
                error = 'Failed to delete user';
            }
        }
    }

    function editUser(user) {
        editingUser = { ...user };
        showEditModal = true;
    }

    function getStatusColor(status) {
        const colors = {
            'active': 'bg-green-100 text-green-800',
            'inactive': 'bg-gray-100 text-gray-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'suspended': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    function getRoleIcon(role) {
        return role === 'teacher' ? '👨‍🏫' : '👨‍🎓';
    }
</script>

<svelte:head>
    <title>User Management - Admin Panel</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-indigo-200/50 p-6 mb-8">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        👥 User Management
                    </h1>
                    <p class="text-gray-600 mt-2">Manage students and teachers</p>
                </div>
                <button on:click={() => showAddModal = true} class="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200">
                    ➕ Add User
                </button>
            </div>
        </div>

        <!-- Filters & Search -->
        <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-200/50 p-6 mb-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input 
                        type="text" 
                        bind:value={searchTerm}
                        placeholder="Search by name or email..."
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select bind:value={selectedRole} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                        <option value="all">All Roles</option>
                        <option value="student">Students</option>
                        <option value="teacher">Teachers</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select bind:value={selectedStatus} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
                <div class="flex items-end">
                    <button on:click={loadUsers} class="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                        🔄 Refresh
                    </button>
                </div>
            </div>
        </div>

        {#if loading}
            <div class="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner />
            </div>
        {:else if error}
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
                <p class="text-red-600 font-medium">⚠️ {error}</p>
            </div>
        {:else}
            <!-- User List -->
            <div class="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-indigo-200/50 p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold text-gray-800">Users ({filteredUsers.length})</h3>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-gray-200">
                                <th class="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-700">Courses</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-700">Last Login</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each filteredUsers as user (user.id)}
                                <tr class="border-b border-gray-100 hover:bg-indigo-50/50 transition-colors">
                                    <td class="py-3 px-4">
                                        <div class="flex items-center space-x-3">
                                            <span class="text-xl">{getRoleIcon(user.role)}</span>
                                            <div>
                                                <div class="font-medium text-gray-800">{user.name}</div>
                                                <div class="text-sm text-gray-500">Joined {user.joinDate}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-3 px-4 text-gray-600">{user.email}</td>
                                    <td class="py-3 px-4">
                                        <span class="capitalize font-medium">{user.role}</span>
                                    </td>
                                    <td class="py-3 px-4">
                                        <span class="{getStatusColor(user.status)} px-2 py-1 rounded-full text-xs font-medium capitalize">
                                            {user.status}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 font-medium">{user.courses}</td>
                                    <td class="py-3 px-4 text-gray-600">
                                        {user.lastLogin || 'Never'}
                                    </td>
                                    <td class="py-3 px-4">
                                        <div class="flex space-x-2">
                                            <button on:click={() => editUser(user)} class="text-blue-600 hover:text-blue-800 font-medium">
                                                ✏️ Edit
                                            </button>
                                            <button on:click={() => deleteUser(user.id)} class="text-red-600 hover:text-red-800 font-medium">
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        {/if}
    </div>
</div>

<!-- Add User Modal -->
{#if showAddModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 class="text-xl font-bold text-gray-800 mb-6">➕ Add New User</h3>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" bind:value={newUser.name} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" bind:value={newUser.email} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select bind:value={newUser.role} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input type="password" bind:value={newUser.password} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
            </div>
            
            <div class="flex space-x-4 mt-6">
                <button on:click={() => showAddModal = false} class="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600">
                    Cancel
                </button>
                <button on:click={addUser} class="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
                    Add User
                </button>
            </div>
        </div>
    </div>
{/if}

<!-- Edit User Modal -->
{#if showEditModal && editingUser}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 class="text-xl font-bold text-gray-800 mb-6">✏️ Edit User</h3>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" bind:value={editingUser.name} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" bind:value={editingUser.email} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select bind:value={editingUser.role} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select bind:value={editingUser.status} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>
            
            <div class="flex space-x-4 mt-6">
                <button on:click={() => showEditModal = false} class="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600">
                    Cancel
                </button>
                <button on:click={updateUser} class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                    Update
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .backdrop-blur-xl {
        backdrop-filter: blur(20px);
    }
</style>