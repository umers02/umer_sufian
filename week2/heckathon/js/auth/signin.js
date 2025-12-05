// Signin page component
const SigninPage = {
    render: () => {
        return `
            ${Navbar.render()}
            <main class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full space-y-8">
                    <div class="text-center">
                        <h2 class="text-3xl font-bold text-gray-900 mb-8">Welcome back</h2>
                    </div>
                    
                    <form id="signinForm" class="space-y-4">
                        <div>
                            <input 
                                id="email" 
                                type="email" 
                                required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-100"
                                placeholder="Email"
                            >
                        </div>
                        
                        <div>
                            <input 
                                id="password" 
                                type="password" 
                                required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-100"
                                placeholder="Password"
                            >
                        </div>
                        
                        <div class="text-left">
                            <a href="#" class="text-sm text-gray-500 hover:text-gray-700">Forgot password?</a>
                        </div>
                        
                        <button 
                            type="submit" 
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
                        >
                            Log in
                        </button>
                    </form>
                    
                    <div class="text-center">
                        <p class="text-gray-600">
                            Don't have an account? 
                            <a href="#" id="signUpLink" class="text-blue-600 hover:text-blue-700 font-medium">Sign up</a>
                        </p>
                    </div>
                </div>
            </main>
        `;
    },

    init: () => {
        // Handle form submission
        document.getElementById('signinForm').addEventListener('submit', (e) => {
            e.preventDefault();
            SigninPage.handleSignin();
        });

        // Handle sign up link
        document.getElementById('signUpLink').addEventListener('click', (e) => {
            e.preventDefault();
            Router.navigate('signup');
        });
    },

    handleSignin: () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Get stored user data
        const storedUser = Storage.getUser();

        if (!storedUser) {
            alert('No account found. Please sign up first.');
            return;
        }

        // Validate credentials
        if (storedUser.email === email && storedUser.password === password) {
            alert('Login successful!');
            Router.navigate('profile');
        } else {
            alert('Invalid email or password!');
        }
    }
};