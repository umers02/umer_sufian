// Navbar component
const Navbar = {
    render: () => {
        const currentPage = Router.getCurrentPage();
        const isSelectQuizPage = currentPage === 'quizzes';
        
        return `
            <nav class="bg-white border-b border-gray-100">
                <div class="max-w-7xl mx-auto px-4 sm:px-6">
                    <div class="flex ${isSelectQuizPage ? 'justify-between' : 'justify-between'} items-center h-16">
                        <div class="flex items-center ${isSelectQuizPage ? 'space-x-8' : ''}">
                            <div class="flex items-center space-x-2">
                                <div class="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                                    <span class="text-white text-xs font-bold">■</span>
                                </div>
                                <span class="text-lg font-semibold text-gray-900">QuizMaster</span>
                            </div>
                            
                            ${isSelectQuizPage ? `
                                <!-- Navigation Links for Select Quiz Page -->
                                <div class="hidden md:flex items-center space-x-6 ml-8">
                                    <a href="#" onclick="Router.navigate('landing')" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Home</a>
                                    <a href="#" onclick="Router.navigate('quizzes')" class="text-blue-600 text-sm font-medium">Quizzes</a>
                                    <a href="#" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Leaderboard</a>
                                    <a href="#" onclick="Navbar.navigateToProfile()" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Profile</a>
                                </div>
                            ` : ''}
                        </div>
                        
                        ${isSelectQuizPage ? `
                            <!-- Search and Profile for Select Quiz Page -->
                            <div class="hidden md:flex items-center space-x-4">
                                <div class="relative">
                                    <input 
                                        type="text" 
                                        id="navbarSearchInput"
                                        placeholder="Search" 
                                        oninput="Navbar.handleSearch(this.value)"
                                        class="pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-48"
                                    >
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <i class="fa-solid fa-search text-gray-400 text-sm"></i>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 cursor-pointer transition-colors">
                                        <i class="fa-regular fa-bell text-gray-600"></i>
                                    </div>
                                    <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                                        <img src="assets/img/profile-img.png" alt="Profile" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                                        <div class="w-full h-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-xs font-semibold" style="display:none">
                                            U
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : `
                            <!-- Default Navigation -->
                            <div class="hidden md:flex items-center space-x-8">
                                <a href="#" onclick="Router.navigate('landing')" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Home</a>
                                <a href="#" onclick="Router.navigate('quizzes')" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Quizzes</a>
                                <a href="#" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Leaderboard</a>
                                <a href="#" onclick="Navbar.navigateToProfile()" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Profile</a>
                                <div class="flex items-center space-x-3 ml-4">
                                    <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 cursor-pointer transition-colors">
                                        <i class="fa-regular fa-bell text-gray-600"></i>
                                    </div>
                                    <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                                        <img src="assets/img/profile-img.png" alt="Profile" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                                        <div class="w-full h-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-xs font-semibold" style="display:none">
                                            U
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `}
                        
                        <!-- Mobile menu button -->
                        <div class="md:hidden">
                            <button id="mobileMenuBtn" class="text-gray-600 hover:text-gray-900 focus:outline-none">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Mobile Navigation -->
                    <div id="mobileMenu" class="md:hidden hidden">
                        <div class="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
                            <a href="#" onclick="Router.navigate('landing'); Navbar.closeMobileMenu()" class="block px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">Home</a>
                            <a href="#" onclick="Router.navigate('quizzes'); Navbar.closeMobileMenu()" class="block px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">Quizzes</a>
                            <a href="#" onclick="Navbar.closeMobileMenu()" class="block px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">Leaderboard</a>
                            <a href="#" onclick="Navbar.navigateToProfile(); Navbar.closeMobileMenu()" class="block px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">Profile</a>
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
    },

    handleSearch: (searchValue) => {
        if (window.SelectQuizPage && typeof window.SelectQuizPage.handleSearch === 'function') {
            window.SelectQuizPage.handleSearch(searchValue);
        }
    },

    toggleMobileMenu: () => {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
        }
    },

    closeMobileMenu: () => {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
    },

    init: () => {
        // Add event listener for mobile menu button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'mobileMenuBtn' || e.target.closest('#mobileMenuBtn')) {
                Navbar.toggleMobileMenu();
            }
        });
    }
};