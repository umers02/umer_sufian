// Select Quiz page component
const SelectQuizPage = {
    currentCategory: 'All',
    searchTerm: '',

    render: () => {
        return `
            ${Navbar.render()}
            <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-2xl font-bold text-gray-900">Select a Quiz</h1>
                    <div class="flex items-center space-x-4">
                        <div class="relative">
                            <input 
                                type="text" 
                                id="searchInput"
                                placeholder="Search" 
                                value="${SelectQuizPage.searchTerm}"
                                oninput="SelectQuizPage.handleSearch(this.value)"
                                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <span class="text-gray-400">🔍</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Category Tabs -->
                <div class="border-b border-gray-200 mb-8">
                    <nav class="flex space-x-8">
                        ${SelectQuizPage.renderCategoryTabs()}
                    </nav>
                </div>

                <!-- Featured Quizzes -->
                <div class="mb-8">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Featured Quizzes</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        ${SelectQuizPage.renderFeaturedQuizzes()}
                    </div>
                </div>

                <!-- All Quizzes -->
                <div>
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">All Quizzes</h2>
                    <div id="quizListContainer" class="space-y-4">
                        ${SelectQuizPage.renderAllQuizzes()}
                    </div>
                </div>
            </main>
        `;
    },

    renderCategoryTabs: () => {
        const categories = ['All', 'Science', 'History', 'Literature', 'Mathematics'];
        return categories.map(category => {
            const isActive = category === SelectQuizPage.currentCategory;
            return `
                <button 
                    class="py-2 px-1 border-b-2 ${isActive ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'} font-medium text-sm"
                    onclick="SelectQuizPage.setCategory('${category}')"
                >
                    ${category}
                </button>
            `;
        }).join('');
    },

    renderFeaturedQuizzes: () => {
        const featuredQuizzes = QuizData.quizzes.slice(0, 3);
        return featuredQuizzes.map(quiz => `
            <div class="bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition duration-300" onclick="SelectQuizPage.startQuiz(${quiz.id})">
                <div class="w-16 h-16 bg-orange-300 rounded-full mb-4 flex items-center justify-center">
                    <span class="text-2xl">${SelectQuizPage.getCategoryIcon(quiz.category)}</span>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">${quiz.title}</h3>
                <p class="text-sm text-gray-600">${quiz.description}</p>
            </div>
        `).join('');
    },

    renderAllQuizzes: () => {
        let quizzes = QuizData.getQuizzesByCategory(SelectQuizPage.currentCategory);
        
        // Filter by search term
        if (SelectQuizPage.searchTerm) {
            quizzes = quizzes.filter(quiz => 
                quiz.title.toLowerCase().includes(SelectQuizPage.searchTerm.toLowerCase()) ||
                quiz.description.toLowerCase().includes(SelectQuizPage.searchTerm.toLowerCase())
            );
        }
        
        if (quizzes.length === 0) {
            return '<div class="text-center py-8 text-gray-500">No quizzes found matching your search.</div>';
        }
        
        return quizzes.map(quiz => `
            <div class="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition duration-300 cursor-pointer" onclick="SelectQuizPage.startQuiz(${quiz.id})">
                <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <span class="text-2xl">${SelectQuizPage.getCategoryIcon(quiz.category)}</span>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">${quiz.title}</h3>
                        <p class="text-sm text-gray-600">${quiz.description}</p>
                    </div>
                </div>
                <div class="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                    <span class="text-orange-600">▶</span>
                </div>
            </div>
        `).join('');
    },

    getCategoryIcon: (category) => {
        const icons = {
            'All': '🎯',
            'Science': '🔬',
            'History': '📚',
            'Literature': '📖',
            'Mathematics': '🔢'
        };
        return icons[category] || '❓';
    },

    setCategory: (category) => {
        SelectQuizPage.currentCategory = category;
        SelectQuizPage.searchTerm = '';
        Router.render();
    },

    handleSearch: (searchValue) => {
        SelectQuizPage.searchTerm = searchValue;
        SelectQuizPage.updateQuizList();
    },

    updateQuizList: () => {
        const quizListContainer = document.querySelector('#quizListContainer');
        if (quizListContainer) {
            quizListContainer.innerHTML = SelectQuizPage.renderAllQuizzes();
        }
    },

    startQuiz: (quizId) => {
        Router.navigate('quiz', { quizId });
    },

    init: () => {
        // Initialize with All category
        SelectQuizPage.currentCategory = 'All';
        SelectQuizPage.searchTerm = '';
    }
};