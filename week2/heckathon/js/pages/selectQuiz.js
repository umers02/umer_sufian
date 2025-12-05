// Select Quiz page component
const SelectQuizPage = {
    currentCategory: 'All',
    searchTerm: '',

    render: () => {
        return `
            ${Navbar.render()}
            <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div class="mb-6 sm:mb-8">
                    <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Select a Quiz</h1>
                </div>

                <!-- Category Tabs -->
                <div class="mb-6 sm:mb-8">
                    <nav class="flex flex-wrap gap-2 sm:gap-0 sm:space-x-8">
                        ${SelectQuizPage.renderCategoryTabs()}
                    </nav>
                </div>

                <!-- Featured Quizzes -->
                <div class="mb-6 sm:mb-8">
                    <h2 class="text-base sm:text-lg font-bold text-gray-900 mb-4">Featured Quizzes</h2>
                    <div class="flex flex-wrap gap-4 sm:gap-6 max-w-5xl">
                        <style>
                            .featured-card { width: calc(28.57% - 1rem); }
                            @media (max-width: 640px) { .featured-card { width: 100%; } }
                            @media (min-width: 641px) and (max-width: 768px) { .featured-card { width: calc(50% - 0.5rem); } }
                        </style>
                        ${SelectQuizPage.renderFeaturedQuizzes()}
                    </div>
                </div>

                <!-- All Quizzes -->
                <div>
                    <h2 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">All Quizzes</h2>
                    <div id="quizListContainer" class="space-y-3 sm:space-y-4">
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
                    class="py-2 px-3 bg-gray-100 rounded-lg ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'} font-medium text-xs sm:text-sm whitespace-nowrap"
                    onclick="SelectQuizPage.setCategory('${category}')"
                >
                    ${category}
                </button>
            `;
        }).join('');
    },

    renderFeaturedQuizzes: () => {
        const featuredQuizzes = QuizData.quizzes.slice(0, 3);
        const images = ['universe.jpg', 'science.jpg', 'history.jpg']; // Add different image names here
        return featuredQuizzes.map((quiz, index) => `
            <div class="cursor-pointer featured-card" onclick="SelectQuizPage.startQuiz(${quiz.id})">
                <div class="w-full h-40 sm:h-48 rounded-lg mb-3 sm:mb-4 overflow-hidden">
                    <img src="assets/img/${images[index]}" alt="${quiz.title}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                    <div class="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center" style="display:none">
                        <span class="text-3xl sm:text-4xl">${SelectQuizPage.getCategoryIcon(quiz.category)}</span>
                    </div>
                </div>
                <h3 class="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">${quiz.title}</h3>
                <p class="text-xs sm:text-sm text-gray-600">${quiz.description}</p>
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
        
        const allImages = ['universe.jpg', 'science.jpg', 'history.jpg', 'Literature.jpg', 'mathematics.jpg']; // Add more images as needed
        return quizzes.map((quiz, index) => `
            <div class="flex flex-col sm:flex-row sm:items-start justify-between cursor-pointer" onclick="SelectQuizPage.startQuiz(${quiz.id})">
                <div class="flex-1 mb-3 sm:mb-0">
                    <h3 class="font-bold text-black mb-1 sm:mb-2 text-sm sm:text-base">${quiz.title}</h3>
                    <p class="text-xs sm:text-sm text-gray-600">${quiz.description}</p>
                </div>
                <div class="w-full sm:w-80 h-32 sm:h-40 rounded-lg sm:ml-6 overflow-hidden flex-shrink-0">
                    <img src="assets/img/${allImages[index % allImages.length]}" alt="${quiz.title}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                    <div class="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center" style="display:none">
                        <span class="text-xl sm:text-2xl">${SelectQuizPage.getCategoryIcon(quiz.category)}</span>
                    </div>
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
        // Make globally accessible for navbar
        window.SelectQuizPage = SelectQuizPage;
    }
};

// Make globally accessible
window.SelectQuizPage = SelectQuizPage;