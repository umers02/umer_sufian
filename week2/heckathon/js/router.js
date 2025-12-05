// Simple router for navigation
const Router = {
    currentPage: 'landing',
    params: {},
    
    navigate: (page, params = {}) => {
        Router.currentPage = page;
        Router.params = params;
        Router.render();
    },
    
    render: () => {
        const app = document.getElementById('app');
        
        switch (Router.currentPage) {
            case 'landing':
                app.innerHTML = LandingPage.render();
                LandingPage.init();
                break;
            case 'signup':
                app.innerHTML = SignupPage.render();
                SignupPage.init();
                break;
            case 'signin':
                app.innerHTML = SigninPage.render();
                SigninPage.init();
                break;
            case 'profile':
                app.innerHTML = ProfilePage.render();
                ProfilePage.init();
                break;
            case 'quizzes':
                app.innerHTML = SelectQuizPage.render();
                SelectQuizPage.init();
                break;
            case 'quiz':
                app.innerHTML = QuizPage.render(Router.params.quizId);
                QuizPage.init();
                break;
            case 'results':
                app.innerHTML = ResultsPage.render(Router.params.result);
                ResultsPage.init(Router.params.result);
                break;
            case 'review':
                app.innerHTML = ReviewPage.render(Router.params.result);
                ReviewPage.init();
                break;
            case 'landing':
                app.innerHTML = LandingPage.render();
                LandingPage.init();
                break;
            default:
                app.innerHTML = LandingPage.render();
                LandingPage.init();
        }
    }
};