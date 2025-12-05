// Navbar component
const Navbar = {
    render: () => {
        return `
            <nav class="bg-white border-b border-gray-100">
                <div class="max-w-7xl mx-auto px-6">
                    <div class="flex justify-between items-center h-16">
                        <div class="flex items-center">
                            <div class="flex items-center space-x-2">
                                <div class="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                                    <span class="text-white text-xs font-bold">■</span>
                                </div>
                                <span class="text-lg font-semibold text-gray-900">QuizMaster</span>
                            </div>
                        </div>
                        <div class="flex items-center space-x-8">
                            <a href="#" onclick="Router.navigate('landing')" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Home</a>
                            <a href="#" onclick="Router.navigate('quizzes')" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Quizzes</a>
                            <a href="#" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Leaderboard</a>
                            <a href="#" onclick="Navbar.navigateToProfile()" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Profile</a>
                            <div class="flex items-center space-x-3 ml-4">
                                <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 cursor-pointer transition-colors">
                                    <span class="text-gray-600 text-sm">🔔</span>
                                </div>
                                <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                                    <img src="assets/img/profile-img.png" alt="Profile" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                                    <div class="w-full h-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-xs font-semibold" style="display:none">
                                        U
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    },

    navigateToProfile: () => {
        const user = Storage.getUser();
        if (user) {
            Router.navigate('profile');
        } else {
            alert('Please sign in to access your profile.');
            Router.navigate('signin');
        }
    }
};