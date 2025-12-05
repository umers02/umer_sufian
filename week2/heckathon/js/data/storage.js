// LocalStorage utility functions
const Storage = {
    // User data
    saveUser: (userData) => {
        localStorage.setItem('quizmaster_user', JSON.stringify(userData));
    },
    
    getUser: () => {
        const user = localStorage.getItem('quizmaster_user');
        return user ? JSON.parse(user) : null;
    },
    
    // Quiz results
    saveQuizResult: (result) => {
        const results = Storage.getQuizResults();
        results.push(result);
        localStorage.setItem('quizmaster_results', JSON.stringify(results));
    },
    
    getQuizResults: () => {
        const results = localStorage.getItem('quizmaster_results');
        return results ? JSON.parse(results) : [];
    },
    
    // Clear all data
    clearAll: () => {
        localStorage.removeItem('quizmaster_user');
        localStorage.removeItem('quizmaster_results');
    }
};