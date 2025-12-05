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
            <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-8">Review Incorrect Answers</h1>
                
                <div class="space-y-8">
                    ${incorrectQuestions.length === 0 ? 
                        '<div class="text-center py-8 text-gray-600">Congratulations! You answered all questions correctly!</div>' :
                        incorrectQuestions.map((item, index) => `
                            <div class="bg-white rounded-lg p-6 shadow-sm border">
                                <h3 class="text-lg font-semibold text-gray-900 mb-3">Question ${item.questionIndex + 1}</h3>
                                <p class="text-gray-800 mb-4">${item.question.question}</p>
                                
                                <div class="space-y-2">
                                    <div>
                                        <span class="text-sm font-medium text-gray-700">Your answer: </span>
                                        <span class="text-red-600">${item.userAnswer}</span>
                                    </div>
                                    <div>
                                        <span class="text-sm font-medium text-gray-700">Correct answer: </span>
                                        <span class="text-green-600">${item.correctAnswer}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>

                <div class="mt-8 text-center">
                    <button 
                        onclick="Router.navigate('quizzes')"
                        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
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