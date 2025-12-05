// Quiz Results page component
const ResultsPage = {
    render: (resultData) => {
        const result = JSON.parse(resultData);
        const user = Storage.getUser();
        const percentage = Math.round((result.score / result.totalQuestions) * 100);

        return `
            ${Navbar.render()}
            <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="text-center">
                    <h1 class="text-3xl font-bold text-gray-900 mb-8">Quiz Results</h1>
                    
                    <!-- Progress Bar -->
                    <div class="mb-8">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-medium text-gray-700">Quiz Completed</span>
                            <span class="text-sm font-medium text-gray-700">${percentage}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-gray-800 h-2 rounded-full" style="width: 100%"></div>
                        </div>
                    </div>

                    <!-- Score Card -->
                    <div class="bg-gray-100 rounded-lg p-8 mb-8 max-w-md mx-auto">
                        <div class="mb-4">
                            <h3 class="text-lg font-medium text-gray-700 mb-2">Score</h3>
                            <div class="text-4xl font-bold text-gray-900">${result.score}/${result.totalQuestions}</div>
                        </div>
                    </div>

                    <!-- Congratulations Message -->
                    <div class="mb-8">
                        <p class="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Congratulations, ${user ? user.fullName : 'User'}! You've completed the quiz with a score of ${result.score} out of ${result.totalQuestions}. Your performance indicates a strong understanding of the subject matter. Keep up the excellent work!
                        </p>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            id="reviewBtn"
                            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                        >
                            Review Answers
                        </button>
                        
                        <button 
                            onclick="Router.navigate('quizzes')"
                            class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
                        >
                            Take Another Quiz
                        </button>
                    </div>
                </div>
            </main>
        `;
    },

    init: (resultData) => {
        // Add event listener for Review Answers button
        const reviewBtn = document.getElementById('reviewBtn');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => {
                Router.navigate('review', { result: resultData });
            });
        }
    }
};