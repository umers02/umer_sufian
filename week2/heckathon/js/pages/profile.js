// Profile page component
const ProfilePage = {
    render: () => {
        const user = Storage.getUser();
        const results = Storage.getQuizResults();
        
        if (!user) {
            Router.navigate('signin');
            return '';
        }

        return `
            ${Navbar.render()}
            <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Profile Header -->
                <div class="text-center mb-8">
                    <div class="w-32 h-32 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                        <img src="assets/img/profile-img.png" alt="Profile" class="w-24 h-24 rounded-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                        <div class="w-24 h-24 bg-orange-400 rounded-full flex items-center justify-center text-white text-2xl font-bold" style="display:none">
                            ${user.fullName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <h1 class="text-2xl font-bold text-gray-900">${user.fullName}</h1>
                    <p class="text-gray-600">Quiz Enthusiast</p>
                    <p class="text-gray-500 text-sm">Joined ${new Date(user.joinDate).getFullYear()}</p>
                </div>

                <!-- Tabs -->
                <div class="border-b border-gray-200 mb-6">
                    <nav class="flex space-x-8">
                        <button class="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">Activity</button>
                        <button class="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">Profile</button>
                    </nav>
                </div>

                <!-- Personal Information -->
                <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <p class="text-gray-900">${user.fullName}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <p class="text-gray-900">${user.email}</p>
                        </div>
                    </div>
                    <div class="mt-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <p class="text-gray-600">Avid quiz taker and trivia lover. Always up for a challenge!</p>
                    </div>
                </div>

                <!-- Quiz History -->
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Quiz History</h2>
                    <div class="overflow-x-auto">
                        <table class="min-w-full">
                            <thead>
                                <tr class="border-b border-gray-200">
                                    <th class="text-left py-3 px-4 font-medium text-gray-700">Quiz Name</th>
                                    <th class="text-left py-3 px-4 font-medium text-gray-700">Score</th>
                                    <th class="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${ProfilePage.renderQuizHistory(results)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        `;
    },

    renderQuizHistory: (results) => {
        if (results.length === 0) {
            return `
                <tr>
                    <td colspan="3" class="text-center py-8 text-gray-500">
                        No quiz history yet. Take your first quiz!
                    </td>
                </tr>
            `;
        }

        // Sample data for demonstration
        const sampleHistory = [
            { name: 'General Knowledge', score: '85/100', date: '2023-08-15' },
            { name: 'Science Trivia', score: '70/100', date: '2023-08-10' },
            { name: 'History Buff', score: '92/100', date: '2023-08-05' }
        ];

        return sampleHistory.map(quiz => `
            <tr class="border-b border-gray-100">
                <td class="py-4 px-4 text-gray-900">${quiz.name}</td>
                <td class="py-4 px-4 text-gray-600">${quiz.score}</td>
                <td class="py-4 px-4 text-gray-600">${quiz.date}</td>
            </tr>
        `).join('');
    },

    init: () => {
        // Add any event listeners if needed
    }
};