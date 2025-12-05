// Signup page component
const SignupPage = {
    render: () => {
        return `
            ${Navbar.render()}
            <main class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full space-y-8">
                    <div class="text-center">
                        <h2 class="text-3xl font-bold text-gray-900 mb-8">Create your account</h2>
                    </div>
                    
                    <form id="signupForm" class="space-y-4">
                        <div>
                            <input 
                                id="fullName" 
                                type="text" 
                                required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Full Name"
                            >
                        </div>
                        
                        <div>
                            <input 
                                id="email" 
                                type="email" 
                                required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Email"
                            >
                        </div>
                        
                        <div>
                            <input 
                                id="password" 
                                type="password" 
                                required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Password"
                            >
                        </div>
                        
                        <div>
                            <input 
                                id="confirmPassword" 
                                type="password" 
                                required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Confirm Password"
                            >
                        </div>
                        
                        <button 
                            type="submit" 
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
                        >
                            Sign Up
                        </button>
                    </form>
                    
                    <div class="text-center">
                        <p class="text-gray-600">
                            Already have an account? 
                            <a href="#" id="signInLink" class=" hover:text-blue-700 font-medium">Sign In</a>
                        </p>
                    </div>
                </div>
            </main>
        `;
    },

    init: () => {
        // Handle form submission
        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            SignupPage.handleSignup();
        });

        // Handle sign in link
        document.getElementById('signInLink').addEventListener('click', (e) => {
            e.preventDefault();
            Router.navigate('signin');
        });
    },

    handleSignup: () => {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Basic validation
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }

        // Save user data to localStorage
        const userData = {
            fullName,
            email,
            password,
            joinDate: new Date().toISOString(),
            quizzesAttempted: 0,
            totalScore: 0
        };

        Storage.saveUser(userData);
        alert('Account created successfully!');
        Router.navigate('signin');
    }
};