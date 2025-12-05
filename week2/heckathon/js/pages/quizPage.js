// Quiz page component
const QuizPage = {
    currentQuiz: null,
    currentQuestionIndex: 0,
    selectedAnswers: [],
    timer: null,
    timeRemaining: 30,

    render: (quizId) => {
        QuizPage.currentQuiz = QuizData.getQuizById(parseInt(quizId));
        if (!QuizPage.currentQuiz) {
            return '<div class="p-8 text-center">Quiz not found</div>';
        }

        const currentQuestion = QuizPage.currentQuiz.questions[QuizPage.currentQuestionIndex];
        const progress = ((QuizPage.currentQuestionIndex + 1) / QuizPage.currentQuiz.questions.length) * 100;

        return `
            ${Navbar.render()}
            <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Progress Section -->
                <div class="mb-8">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Progress</h3>
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div class="bg-gray-800 h-2 rounded-full transition-all duration-300" style="width: ${progress}%"></div>
                    </div>
                    <p class="text-sm text-gray-600">Question ${QuizPage.currentQuestionIndex + 1} of ${QuizPage.currentQuiz.questions.length}</p>
                </div>

                <!-- Timer -->
                <div class="flex justify-center mb-8">
                    <div class="flex space-x-4">
                        <div class="bg-gray-100 rounded-lg p-4 text-center min-w-[80px]">
                            <div class="text-2xl font-bold text-gray-900">00</div>
                            <div class="text-sm text-gray-600">Hours</div>
                        </div>
                        <div class="bg-gray-100 rounded-lg p-4 text-center min-w-[80px]">
                            <div class="text-2xl font-bold text-gray-900">00</div>
                            <div class="text-sm text-gray-600">Minutes</div>
                        </div>
                        <div class="bg-gray-100 rounded-lg p-4 text-center min-w-[80px]">
                            <div id="seconds" class="text-2xl font-bold text-gray-900">${QuizPage.timeRemaining.toString().padStart(2, '0')}</div>
                            <div class="text-sm text-gray-600">Seconds</div>
                        </div>
                    </div>
                </div>

                <!-- Question -->
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">${currentQuestion.question}</h2>
                    
                    <div class="space-y-3">
                        ${currentQuestion.options.map((option, index) => `
                            <label class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200">
                                <input 
                                    type="radio" 
                                    name="answer" 
                                    value="${index}"
                                    ${QuizPage.selectedAnswers[QuizPage.currentQuestionIndex] === index ? 'checked' : ''}
                                    onchange="QuizPage.selectAnswer(${index})"
                                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                >
                                <span class="ml-3 text-gray-900">${option}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <!-- Navigation -->
                <div class="flex justify-between">
                    <button 
                        onclick="QuizPage.previousQuestion()"
                        ${QuizPage.currentQuestionIndex === 0 ? 'disabled' : ''}
                        class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    
                    <button 
                        onclick="QuizPage.nextQuestion()"
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        ${QuizPage.currentQuestionIndex === QuizPage.currentQuiz.questions.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </main>
        `;
    },

    selectAnswer: (answerIndex) => {
        QuizPage.selectedAnswers[QuizPage.currentQuestionIndex] = answerIndex;
    },

    nextQuestion: () => {
        if (QuizPage.currentQuestionIndex < QuizPage.currentQuiz.questions.length - 1) {
            QuizPage.currentQuestionIndex++;
            QuizPage.resetTimer();
            QuizPage.updatePage();
        } else {
            QuizPage.finishQuiz();
        }
    },

    previousQuestion: () => {
        if (QuizPage.currentQuestionIndex > 0) {
            QuizPage.currentQuestionIndex--;
            QuizPage.resetTimer();
            QuizPage.updatePage();
        }
    },

    updatePage: () => {
        const app = document.getElementById('app');
        app.innerHTML = QuizPage.render(QuizPage.currentQuiz.id);
    },

    startTimer: () => {
        QuizPage.timer = setInterval(() => {
            QuizPage.timeRemaining--;
            const secondsElement = document.getElementById('seconds');
            if (secondsElement) {
                secondsElement.textContent = QuizPage.timeRemaining.toString().padStart(2, '0');
            }
            
            if (QuizPage.timeRemaining <= 0) {
                QuizPage.timeRemaining = 30;
                QuizPage.nextQuestion();
            }
        }, 1000);
    },

    resetTimer: () => {
        if (QuizPage.timer) {
            clearInterval(QuizPage.timer);
        }
        QuizPage.timeRemaining = 30;
        QuizPage.startTimer();
    },

    finishQuiz: () => {
        if (QuizPage.timer) {
            clearInterval(QuizPage.timer);
        }
        
        // Calculate score
        let correctAnswers = 0;
        QuizPage.currentQuiz.questions.forEach((question, index) => {
            if (QuizPage.selectedAnswers[index] === question.correct) {
                correctAnswers++;
            }
        });

        // Save result
        const result = {
            quizId: QuizPage.currentQuiz.id,
            quizTitle: QuizPage.currentQuiz.title,
            score: correctAnswers,
            totalQuestions: QuizPage.currentQuiz.questions.length,
            answers: QuizPage.selectedAnswers,
            date: new Date().toISOString()
        };
        
        Storage.saveQuizResult(result);
        Router.navigate('results', { result: JSON.stringify(result) });
    },

    init: () => {
        QuizPage.currentQuestionIndex = 0;
        QuizPage.selectedAnswers = [];
        QuizPage.timeRemaining = 30;
        QuizPage.startTimer();
    }
};