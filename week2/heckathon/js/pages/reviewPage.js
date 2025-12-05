// Review Incorrect Answers page component
const ReviewPage = {
    render: (resultData) => {
        const result = JSON.parse(resultData);
        const quiz = QuizData.getQuizById(result.quizId);
        
        if (!quiz) {
            return '<div class="p-8 text-center">Quiz data not found</div>';
        }

        const incorrectQuestions = ReviewPage.getIncorrectQuestions(quiz, result);

        return `
            ${Navbar.render()}
            <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Review Incorrect Answers</h1>
                
                <div class="space-y-4 sm:space-y-6">
                    ${incorrectQuestions.length === 0 ? 
                        '<div class="text-center py-6 sm:py-8 text-gray-600 text-sm sm:text-base">Congratulations! You answered all questions correctly!</div>' :
                        incorrectQuestions.map((item, index) => `
                            <div>
                                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Question ${item.questionIndex + 1}</h3>
                                <p class="text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">${item.question.question}</p>
                                
                                <div class="space-y-1 sm:space-y-2">
                                    <div class="flex flex-col sm:flex-row sm:items-center">
                                        <span class="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-0 sm:mr-2">Your answer: </span>
                                        <span class="text-black text-sm sm:text-base">${item.userAnswer}</span>
                                    </div>
                                    <div class="flex flex-col sm:flex-row sm:items-center">
                                        <span class="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-0 sm:mr-2">Correct answer: </span>
                                        <span class="text-black text-sm sm:text-base">${item.correctAnswer}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>

                <div class="mt-6 sm:mt-8 text-center sm:text-right">
                    <button 
                        onclick="Router.navigate('quizzes')"
                        class="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium text-sm sm:text-base w-full sm:w-auto"
                    >
                        Back to Quizzes
                    </button>
                </div>
            </main>
        `;
    },

    getIncorrectQuestions: (quiz, result) => {
        const incorrectQuestions = [];
        
        quiz.questions.forEach((question, index) => {
            const userAnswerIndex = result.answers[index];
            const correctAnswerIndex = question.correct;
            
            if (userAnswerIndex !== correctAnswerIndex) {
                incorrectQuestions.push({
                    questionIndex: index,
                    question: question,
                    userAnswer: userAnswerIndex !== undefined ? question.options[userAnswerIndex] : 'No answer',
                    correctAnswer: question.options[correctAnswerIndex]
                });
            }
        });
        
        return incorrectQuestions;
    },

    init: () => {
        // Any initialization logic if needed
    }
};