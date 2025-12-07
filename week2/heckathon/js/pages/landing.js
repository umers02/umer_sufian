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
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2_360)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.75C7.02944 3.75 3 7.77944 3 12.75C3 17.7206 7.02944 21.75 12 21.75C16.9706 21.75 21 17.7206 21 12.75C20.9943 7.78179 16.9682 3.75568 12 3.75ZM12 20.25C7.85786 20.25 4.5 16.8921 4.5 12.75C4.5 8.60786 7.85786 5.25 12 5.25C16.1421 5.25 19.5 8.60786 19.5 12.75C19.4953 16.8902 16.1402 20.2453 12 20.25ZM16.2806 8.46937C16.4215 8.61005 16.5006 8.80094 16.5006 9C16.5006 9.19906 16.4215 9.38995 16.2806 9.53063L12.5306 13.2806C12.2376 13.5737 11.7624 13.5737 11.4694 13.2806C11.1763 12.9876 11.1763 12.5124 11.4694 12.2194L15.2194 8.46937C15.3601 8.32854 15.5509 8.24941 15.75 8.24941C15.9491 8.24941 16.1399 8.32854 16.2806 8.46937ZM9 1.5C9 1.08579 9.33579 0.75 9.75 0.75H14.25C14.6642 0.75 15 1.08579 15 1.5C15 1.91421 14.6642 2.25 14.25 2.25H9.75C9.33579 2.25 9 1.91421 9 1.5Z" fill="#121417"/>
</g>
<defs>
<clipPath id="clip0_2_360">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
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
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2_370)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.75 6H19.5V5.25C19.5 4.42157 18.8284 3.75 18 3.75H6C5.17157 3.75 4.5 4.42157 4.5 5.25V6H2.25C1.42157 6 0.75 6.67157 0.75 7.5V9C0.75 11.0711 2.42893 12.75 4.5 12.75H4.84219C5.74518 15.6116 8.26452 17.6614 11.25 17.9634V20.25H9C8.58579 20.25 8.25 20.5858 8.25 21C8.25 21.4142 8.58579 21.75 9 21.75H15C15.4142 21.75 15.75 21.4142 15.75 21C15.75 20.5858 15.4142 20.25 15 20.25H12.75V17.9606C15.7444 17.6578 18.2288 15.5569 19.1325 12.75H19.5C21.5711 12.75 23.25 11.0711 23.25 9V7.5C23.25 6.67157 22.5784 6 21.75 6ZM4.5 11.25C3.25736 11.25 2.25 10.2426 2.25 9V7.5H4.5V10.5C4.5 10.75 4.51219 11 4.53656 11.25H4.5ZM18 10.4156C18 13.7456 15.3291 16.4756 12.0459 16.5H12C8.68629 16.5 6 13.8137 6 10.5V5.25H18V10.4156ZM21.75 9C21.75 10.2426 20.7426 11.25 19.5 11.25H19.4531C19.4839 10.9729 19.4995 10.6944 19.5 10.4156V7.5H21.75V9Z" fill="#121417"/>
</g>
<defs>
<clipPath id="clip0_2_370">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
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
   <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 15.75C19.5 16.1642 19.1642 16.5 18.75 16.5H0.75C0.335786 16.5 0 16.1642 0 15.75V0.75C0 0.335786 0.335786 0 0.75 0C1.16421 0 1.5 0.335786 1.5 0.75V9.59719L6.25594 5.4375C6.52266 5.20401 6.91644 5.18915 7.2 5.40187L12.7134 9.53719L18.2559 4.6875C18.454 4.49149 18.7443 4.4214 19.0099 4.5055C19.2756 4.58959 19.4727 4.81402 19.5218 5.08828C19.5709 5.36254 19.464 5.64143 19.2441 5.8125L13.2441 11.0625C12.9773 11.296 12.5836 11.3108 12.3 11.0981L6.78656 6.96469L1.5 11.5903V15H18.75C19.1642 15 19.5 15.3358 19.5 15.75Z" fill="#121417"/>
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