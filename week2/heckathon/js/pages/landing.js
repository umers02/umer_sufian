// Landing page component
const LandingPage = {
    render: () => {
        return `
            ${Navbar.render()}
            <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <!-- Hero Section -->
                <div class="bg-gradient-to-br from-orange-100 via-yellow-50 to-green-100 rounded-2xl p-12 mb-16 relative overflow-hidden">
                    <div class="flex items-center justify-center relative">
                        <div class="absolute inset-0 flex items-center justify-center">
                            <img src="assets/img/welcome-to-quiz.png" alt="Quiz Illustration" class="max-w-lg h-auto opacity-80" onerror="this.style.display='none'">
                        </div>
                        <div class="relative z-10 text-center">
                            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                                Welcome to QuizMaster
                            </h1>
                            <p class="text-lg text-white mb-8 max-w-2xl mx-auto">
                                Test your knowledge with our engaging quizzes. Compete with friends and climb the leaderboard. Start your quiz journey today!
                            </p>
                            <button id="getStartedBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Key Features Section -->
                <section class="mb-16">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
                    <p class="text-gray-600 mb-12">
                        Explore the exciting features that make QuizMaster the ultimate quiz app
                    </p>
                    
                    <div class="grid md:grid-cols-3 gap-8">
                        <!-- Timed Quizzes -->
                        <div class="bg-white p-6 rounded-lg border border-gray-200">
                            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                <span class="text-xl">⏰</span>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Timed Quizzes</h3>
                            <p class="text-gray-600 text-sm">
                                Challenge yourself with timed quizzes to test your speed and accuracy.
                            </p>
                        </div>

                        <!-- Leaderboard -->
                        <div class="bg-white p-6 rounded-lg border border-gray-200">
                            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                <span class="text-xl">🏆</span>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Leaderboard</h3>
                            <p class="text-gray-600 text-sm">
                                Compete with friends and other users to see who can achieve the highest scores.
                            </p>
                        </div>

                        <!-- Progress Tracking -->
                        <div class="bg-white p-6 rounded-lg border border-gray-200">
                            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                <span class="text-xl">📊</span>
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
        // Add event listener for Get Started button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'getStartedBtn') {
                Router.navigate('signup');
            }
        });
    }
};