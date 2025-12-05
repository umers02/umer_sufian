// Landing page component
const LandingPage = {
    render: () => {
        return `
            ${Navbar.render()}
            <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <!-- Hero Section -->
                <div class="mb-16 relative">
                    <div class="relative">
                        <img src="assets/img/welcome-to-quiz.png" alt="Quiz Illustration" class="w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] object-cover rounded-sm" onerror="this.style.display='none'">
                        <div class="absolute inset-0 rounded-2xl" style="background: linear-gradient(90deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%);"></div>
                        <div class="absolute inset-0 flex items-end justify-center pb-16">
                            <div class="text-center">
                                <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 px-4">
                                    Welcome to QuizMaster
                                </h1>
                                <p class="text-xs sm:text-sm md:text-base text-white mb-6 sm:mb-8 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto px-4">
                                    Test your knowledge with our engaging quizzes. Compete with friends and climb the leaderboard. Start your quiz journey today!
                                </p>
                                <button id="getStartedBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-lg transition duration-300 text-sm sm:text-base">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Key Features Section -->
                <section class="mb-16">
                    <h2 class="text-3xl font-extrabold text-gray-900 mb-4">Key Features</h2>
                    <p class="text-gray-600 mb-12">
                        Explore the exciting features that make QuizMaster the ultimate quiz app
                    </p>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        <!-- Timed Quizzes -->
                        <div class="bg-white p-6 rounded-lg border border-gray-200">
                            <div class="w-10 h-10  rounded-lg flex items-center justify-center mb-4">
                                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Timed Quizzes</h3>
                            <p class="text-gray-600 text-sm">
                                Challenge yourself with timed quizzes to test your speed and accuracy.
                            </p>
                        </div>

                        <!-- Leaderboard -->
                        <div class="bg-white p-6 rounded-lg border border-gray-200">
                            <div class="w-10 h-10  rounded-lg flex items-center justify-center mb-4">
                                <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 10.1 14.1 11 13 11V22H11V11C9.9 11 9 10.1 9 9V7H3V9C3 10.1 3.9 11 5 11V22H7V11C8.1 11 9 10.1 9 9V7L15 7C15 8.1 15.9 9 17 9V22H19V9C20.1 9 21 8.1 21 7V9Z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Leaderboard</h3>
                            <p class="text-gray-600 text-sm">
                                Compete with friends and other users to see who can achieve the highest scores.
                            </p>
                        </div>

                        <!-- Progress Tracking -->
                        <div class="bg-white p-6 rounded-lg border border-gray-200">
                            <div class="w-10 h-10  rounded-lg flex items-center justify-center mb-4">
                                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                            <p class="text-gray-600 text-sm">
                                Track your progress and see how you improve over time with detailed performance reports.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        `;
    },

    init: () => {
        // Initialize navbar
        Navbar.init();
        
        // Add event listener for Get Started button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'getStartedBtn') {
                Router.navigate('signup');
            }
        });
    }
};