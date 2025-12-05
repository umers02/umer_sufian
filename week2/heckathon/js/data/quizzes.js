// Quiz data - 5 different quizzes with 10 questions each
const QuizData = {
    quizzes: [
        {
            id: 1,
            title: "General Knowledge",
            category: "All",
            description: "Test your overall knowledge across various topics",
            questions: [
                {
                    question: "What is the capital of France?",
                    options: ["London", "Berlin", "Paris", "Madrid"],
                    correct: 2
                },
                {
                    question: "Which planet is known as the Red Planet?",
                    options: ["Venus", "Mars", "Jupiter", "Saturn"],
                    correct: 1
                },
                {
                    question: "Who painted the Mona Lisa?",
                    options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
                    correct: 2
                },
                {
                    question: "What is the largest ocean on Earth?",
                    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
                    correct: 3
                },
                {
                    question: "In which year did World War II end?",
                    options: ["1944", "1945", "1946", "1947"],
                    correct: 1
                },
                {
                    question: "What is the chemical symbol for gold?",
                    options: ["Go", "Gd", "Au", "Ag"],
                    correct: 2
                },
                {
                    question: "Which is the smallest country in the world?",
                    options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
                    correct: 1
                },
                {
                    question: "Who wrote 'Romeo and Juliet'?",
                    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                    correct: 1
                },
                {
                    question: "What is the hardest natural substance on Earth?",
                    options: ["Gold", "Iron", "Diamond", "Platinum"],
                    correct: 2
                },
                {
                    question: "Which gas makes up most of Earth's atmosphere?",
                    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
                    correct: 1
                }
            ]
        },
        {
            id: 2,
            title: "Science",
            category: "Science",
            description: "Explore the wonders of science from biology to physics",
            questions: [
                {
                    question: "What is the speed of light?",
                    options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
                    correct: 0
                },
                {
                    question: "Which element has the atomic number 1?",
                    options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
                    correct: 1
                },
                {
                    question: "What is the powerhouse of the cell?",
                    options: ["Nucleus", "Ribosome", "Mitochondria", "Cytoplasm"],
                    correct: 2
                },
                {
                    question: "Which planet has the most moons?",
                    options: ["Jupiter", "Saturn", "Neptune", "Uranus"],
                    correct: 1
                },
                {
                    question: "What is the chemical formula for water?",
                    options: ["H2O", "CO2", "NaCl", "CH4"],
                    correct: 0
                },
                {
                    question: "Which scientist developed the theory of relativity?",
                    options: ["Newton", "Darwin", "Einstein", "Galileo"],
                    correct: 2
                },
                {
                    question: "What is the largest organ in the human body?",
                    options: ["Brain", "Liver", "Lungs", "Skin"],
                    correct: 3
                },
                {
                    question: "Which gas do plants absorb from the atmosphere?",
                    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
                    correct: 2
                },
                {
                    question: "What is the study of earthquakes called?",
                    options: ["Geology", "Seismology", "Meteorology", "Astronomy"],
                    correct: 1
                },
                {
                    question: "Which blood type is known as the universal donor?",
                    options: ["A", "B", "AB", "O"],
                    correct: 3
                }
            ]
        },
        {
            id: 3,
            title: "History",
            category: "History",
            description: "Journey through time and test your historical events",
            questions: [
                {
                    question: "Who was the first President of the United States?",
                    options: ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"],
                    correct: 1
                },
                {
                    question: "In which year did the Berlin Wall fall?",
                    options: ["1987", "1988", "1989", "1990"],
                    correct: 2
                },
                {
                    question: "Which ancient wonder of the world was located in Egypt?",
                    options: ["Hanging Gardens", "Colossus of Rhodes", "Great Pyramid", "Lighthouse of Alexandria"],
                    correct: 2
                },
                {
                    question: "Who was known as the 'Iron Lady'?",
                    options: ["Queen Elizabeth", "Margaret Thatcher", "Indira Gandhi", "Golda Meir"],
                    correct: 1
                },
                {
                    question: "Which empire was ruled by Julius Caesar?",
                    options: ["Greek", "Roman", "Persian", "Egyptian"],
                    correct: 1
                },
                {
                    question: "In which year did the Titanic sink?",
                    options: ["1910", "1911", "1912", "1913"],
                    correct: 2
                },
                {
                    question: "Who painted the ceiling of the Sistine Chapel?",
                    options: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Donatello"],
                    correct: 1
                },
                {
                    question: "Which war was fought between 1914-1918?",
                    options: ["World War II", "Civil War", "World War I", "Korean War"],
                    correct: 2
                },
                {
                    question: "Who discovered America in 1492?",
                    options: ["Vasco da Gama", "Christopher Columbus", "Ferdinand Magellan", "Marco Polo"],
                    correct: 1
                },
                {
                    question: "Which ancient civilization built Machu Picchu?",
                    options: ["Aztec", "Maya", "Inca", "Olmec"],
                    correct: 2
                }
            ]
        },
        {
            id: 4,
            title: "Literature",
            category: "Literature",
            description: "Discover the world of books and authors",
            questions: [
                {
                    question: "Who wrote 'Pride and Prejudice'?",
                    options: ["Charlotte Bronte", "Jane Austen", "Emily Dickinson", "Virginia Woolf"],
                    correct: 1
                },
                {
                    question: "Which book begins with 'It was the best of times, it was the worst of times'?",
                    options: ["Great Expectations", "Oliver Twist", "A Tale of Two Cities", "David Copperfield"],
                    correct: 2
                },
                {
                    question: "Who wrote '1984'?",
                    options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "Kurt Vonnegut"],
                    correct: 1
                },
                {
                    question: "Which Shakespeare play features the character Hamlet?",
                    options: ["Macbeth", "Othello", "King Lear", "Hamlet"],
                    correct: 3
                },
                {
                    question: "Who wrote 'To Kill a Mockingbird'?",
                    options: ["Harper Lee", "Toni Morrison", "Maya Angelou", "Zora Neale Hurston"],
                    correct: 0
                },
                {
                    question: "Which novel features the character Jay Gatsby?",
                    options: ["The Catcher in the Rye", "The Great Gatsby", "Of Mice and Men", "The Grapes of Wrath"],
                    correct: 1
                },
                {
                    question: "Who wrote 'One Hundred Years of Solitude'?",
                    options: ["Pablo Neruda", "Gabriel Garcia Marquez", "Mario Vargas Llosa", "Jorge Luis Borges"],
                    correct: 1
                },
                {
                    question: "Which book series features Harry Potter?",
                    options: ["Chronicles of Narnia", "Lord of the Rings", "Harry Potter", "Percy Jackson"],
                    correct: 2
                },
                {
                    question: "Who wrote 'The Catcher in the Rye'?",
                    options: ["J.D. Salinger", "Ernest Hemingway", "F. Scott Fitzgerald", "John Steinbeck"],
                    correct: 0
                },
                {
                    question: "Which poem begins with 'Two roads diverged in a yellow wood'?",
                    options: ["The Raven", "The Road Not Taken", "Stopping by Woods", "Fire and Ice"],
                    correct: 1
                }
            ]
        },
        {
            id: 5,
            title: "Mathematics",
            category: "Mathematics",
            description: "Challenge your brain with various mathematical problems",
            questions: [
                {
                    question: "What is the value of π (pi) approximately?",
                    options: ["3.14", "2.71", "1.41", "1.73"],
                    correct: 0
                },
                {
                    question: "What is 15% of 200?",
                    options: ["25", "30", "35", "40"],
                    correct: 1
                },
                {
                    question: "What is the square root of 144?",
                    options: ["11", "12", "13", "14"],
                    correct: 1
                },
                {
                    question: "If x + 5 = 12, what is x?",
                    options: ["6", "7", "8", "9"],
                    correct: 1
                },
                {
                    question: "What is 8 × 7?",
                    options: ["54", "56", "58", "60"],
                    correct: 1
                },
                {
                    question: "What is the area of a circle with radius 3?",
                    options: ["9π", "6π", "3π", "12π"],
                    correct: 0
                },
                {
                    question: "What is 2^5?",
                    options: ["16", "25", "32", "64"],
                    correct: 2
                },
                {
                    question: "What is the sum of angles in a triangle?",
                    options: ["90°", "180°", "270°", "360°"],
                    correct: 1
                },
                {
                    question: "What is 100 ÷ 4?",
                    options: ["20", "25", "30", "35"],
                    correct: 1
                },
                {
                    question: "What is the next number in the sequence: 2, 4, 8, 16, ?",
                    options: ["24", "28", "32", "36"],
                    correct: 2
                }
            ]
        }
    ],

    getQuizzesByCategory: (category) => {
        if (category === 'All') {
            return QuizData.quizzes;
        }
        return QuizData.quizzes.filter(quiz => quiz.category === category);
    },

    getQuizById: (id) => {
        return QuizData.quizzes.find(quiz => quiz.id === id);
    }
};