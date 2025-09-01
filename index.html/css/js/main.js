// Global variables to store data
let coursesData = [];
let internshipsData = [];
let bookmarkedItems = JSON.parse(localStorage.getItem('skillbridge_bookmarked')) || [];

// DOM elements
const coursesGrid = document.getElementById('courses-grid');
const internshipsGrid = document.getElementById('internships-grid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const levelFilter = document.getElementById('levelFilter');

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadAllData();
});

// Set up event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', debounce(performSearch, 300));
    categoryFilter.addEventListener('change', performSearch);
    levelFilter.addEventListener('change', performSearch);
    
    // Enter key for search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Load data from JSON files
async function loadAllData() {
    showLoading(coursesGrid);
    showLoading(internshipsGrid);
    
    try {
        // Load courses data
        const coursesResponse = await fetch('data/courses.json');
        const coursesJsonData = await coursesResponse.json();
        coursesData = coursesJsonData.courses;
        
        // Load internships data
        const internshipsResponse = await fetch('data/internships.json');
        const internshipsJsonData = await internshipsResponse.json();
        internshipsData = internshipsJsonData.internships;
        
        // Display the data
        displayCourses(coursesData);
        displayInternships(internshipsData);
        
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to sample data if JSON files don't load
        loadFallbackData();
    }
}

// Fallback sample data (in case JSON files don't work)
function loadFallbackData() {
    coursesData = [
        {
            id: 1,
            title: "JavaScript for Beginners",
            description: "Learn the fundamentals of JavaScript programming from scratch. Perfect for complete beginners.",
            category: "programming",
            level: "beginner",
            provider: "FreeCodeCamp",
            duration: "6 weeks",
            rating: 4.8,
            url: "https://freecodecamp.org/javascript",
            icon: "💻"
        },
        {
            id: 2,
            title: "UI/UX Design Fundamentals", 
            description: "Master the principles of user interface and user experience design.",
            category: "design",
            level: "beginner",
            provider: "Google Design",
            duration: "4 weeks",
            rating: 4.6,
            url: "https://design.google",
            icon: "🎨"
        },
        {
            id: 3,
            title: "Digital Marketing Basics",
            description: "Learn essential digital marketing strategies and tools for modern businesses.",
            category: "marketing", 
            level: "beginner",
            provider: "Google Digital Garage",
            duration: "3 weeks",
            rating: 4.5,
            url: "https://learndigital.withgoogle.com",
            icon: "📱"
        }
    ];

    internshipsData = [
        {
            id: 101,
            title: "Frontend Developer Intern",
            description: "Work with our development team on cutting-edge React applications.",
            company: "TechStart Inc",
            location: "Remote", 
            category: "programming",
            level: "intermediate",
            duration: "3 months",
            paid: true,
            url: "https://techstart.com/careers",
            icon: "💻"
        },
        {
            id: 102,
            title: "UX Design Intern",
            description: "Join our design team to create user-centered digital experiences.",
            company: "Design Co",
            location: "New York, NY",
            category: "design",
            level: "beginner", 
            duration: "4 months",
            paid: true,
            url: "https://designco.com/internships",
            icon: "🎨"
        }
    ];
    
    displayCourses(coursesData);
    displayInternships(internshipsData);
}

// Display courses
function displayCourses(courses) {
    if (courses.length === 0) {
        coursesGrid.innerHTML = '<div class="no-results">No courses found matching your criteria. Try adjusting your filters!</div>';
        return;
    }

    coursesGrid.innerHTML = courses.map(course => createCourseCard(course)).join('');
}

// Display internships
function displayInternships(internships) {
    if (internships.length === 0) {
        internshipsGrid.innerHTML = '<div class="no-results">No internships found matching your criteria. Try adjusting your filters!</div>';
        return;
    }

    internshipsGrid.innerHTML = internships.map(internship => createInternshipCard(internship)).join('');
}

// Create enhanced course card HTML
function createCourseCard(course) {
    const isBookmarked = bookmarkedItems.some(item => item.id === course.id && item.type === 'course');
    const bookmarkClass = isBookmarked ? 'bookmarked' : '';
    const bookmarkSymbol = isBookmarked ? '❤️' : '🤍';

    return `
        <div class="card course-card" data-category="${course.category}" data-level="${course.level}">
            <div class="card-header">
                <div class="card-icon">${course.icon}</div>
                <div class="card-provider">${course.provider}</div>
            </div>
            <div class="card-body">
                <h3 class="card-title">${course.title}</h3>
                <p class="card-description">${course.description}</p>
                
                <div class="card-details">
                    <span class="detail-item">⏱️ ${course.duration}</span>
                    <span class="detail-item">⭐ ${course.rating || 'New'}</span>
                </div>
                
                <div class="card-meta">
                    <span class="card-category">${capitalizeFirst(course.category)}</span>
                    <span class="card-level">${capitalizeFirst(course.level)}</span>
                </div>
                
                <div class="card-footer">
                    <a href="${course.url}" target="_blank" rel="noopener" class="card-link">
                        Start Learning
                    </a>
                    <button class="bookmark-btn ${bookmarkClass}" 
                            onclick="toggleBookmark(${course.id}, 'course', this)"
                            title="Save for later">
                        ${bookmarkSymbol}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Create enhanced internship card HTML
function createInternshipCard(internship) {
    const isBookmarked = bookmarkedItems.some(item => item.id === internship.id && item.type === 'internship');
    const bookmarkClass = isBookmarked ? 'bookmarked' : '';
    const bookmarkSymbol = isBookmarked ? '❤️' : '🤍';
    const paidBadge = internship.paid ? '💰 Paid' : '📚 Unpaid';

    return `
        <div class="card internship-card" data-category="${internship.category}" data-level="${internship.level}">
            <div class="card-header">
                <div class="card-icon">${internship.icon}</div>
                <div class="card-provider">${internship.company}</div>
            </div>
            <div class="card-body">
                <h3 class="card-title">${internship.title}</h3>
                <p class="card-description">${internship.description}</p>
                
                <div class="card-details">
                    <span class="detail-item">📍 ${internship.location}</span>
                    <span class="detail-item">⏱️ ${internship.duration}</span>
                    <span class="detail-item">${paidBadge}</span>
                </div>
                
                ${internship.salary ? `<p class="salary-info">💵 ${internship.salary}</p>` : ''}
                
                <div class="card-meta">
                    <span class="card-category">${capitalizeFirst(internship.category)}</span>
                    <span class="card-level">${capitalizeFirst(internship.level)}</span>
                </div>
                
                <div class="card-footer">
                    <a href="${internship.url}" target="_blank" rel="noopener" class="card-link">
                        Apply Now
                    </a>
                    <button class="bookmark-btn ${bookmarkClass}" 
                            onclick="toggleBookmark(${internship.id}, 'internship', this)"
                            title="Save for later">
                        ${bookmarkSymbol}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Tab switching functionality
function showTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    document.getElementById(tabName + '-content').classList.add('active');
}

// Enhanced search and filter functionality
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedLevel = levelFilter.value;

    // Filter courses
    const filteredCourses = coursesData.filter(course => {
        const matchesSearch = !searchTerm || 
                            course.title.toLowerCase().includes(searchTerm) ||
                            course.description.toLowerCase().includes(searchTerm) ||
                            course.provider.toLowerCase().includes(searchTerm) ||
                            (course.skills && course.skills.some(skill => 
                                skill.toLowerCase().includes(searchTerm)
                            ));
        const matchesCategory = !selectedCategory || course.category === selectedCategory;
        const matchesLevel = !selectedLevel || course.level === selectedLevel;
        
        return matchesSearch && matchesCategory && matchesLevel;
    });

    // Filter internships
    const filteredInternships = internshipsData.filter(internship => {
        const matchesSearch = !searchTerm ||
                            internship.title.toLowerCase().includes(searchTerm) ||
                            internship.description.toLowerCase().includes(searchTerm) ||
                            internship.company.toLowerCase().includes(searchTerm) ||
                            internship.location.toLowerCase().includes(searchTerm) ||
                            (internship.requirements && internship.requirements.some(req => 
                                req.toLowerCase().includes(searchTerm)
                            ));
        const matchesCategory = !selectedCategory || internship.category === selectedCategory;
        const matchesLevel = !selectedLevel || internship.level === selectedLevel;
        
        return matchesSearch && matchesCategory && matchesLevel;
    });

    // Update displays with results count
    displayCourses(filteredCourses);
    displayInternships(filteredInternships);
    
    // Show search results count
    updateResultsCount(filteredCourses.length, filteredInternships.length, searchTerm);
}

// Update results count
function updateResultsCount(coursesCount, internshipsCount, searchTerm) {
    const searchInfo = searchTerm ? ` for "${searchTerm}"` : '';
    
    // You can add this to show results count
    console.log(`Found ${coursesCount} courses and ${internshipsCount} internships${searchInfo}`);
}

// Enhanced bookmark functionality with persistence
function toggleBookmark(itemId, itemType, buttonElement) {
    const existingIndex = bookmarkedItems.findIndex(item => item.id === itemId && item.type === itemType);
    
    if (existingIndex > -1) {
        // Remove bookmark
        bookmarkedItems.splice(existingIndex, 1);
        buttonElement.classList.remove('bookmarked');
        buttonElement.textContent = '🤍';
        showNotification('Removed from saved items');
    } else {
        // Add bookmark
        const itemData = itemType === 'course' 
            ? coursesData.find(course => course.id === itemId)
            : internshipsData.find(internship => internship.id === itemId);
            
        if (itemData) {
            bookmarkedItems.push({ ...itemData, type: itemType, savedDate: new Date().toISOString() });
            buttonElement.classList.add('bookmarked');
            buttonElement.textContent = '❤️';
            showNotification('Saved to your collection!');
        }
    }
    
    // Save to localStorage
    localStorage.setItem('skillbridge_bookmarked', JSON.stringify(bookmarkedItems));
}

// Simple notification system
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification) {
            notification.remove();
        }
    }, 3000);
}

// Smooth scroll to search section
function scrollToSearch() {
    document.getElementById('search').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Loading state
function showLoading(gridElement) {
    gridElement.innerHTML = '<div class="loading">Loading amazing opportunities...</div>';
}

// Utility functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Debounce function for search performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Stats tracking (for your presentation)
function getStats() {
    return {
        totalCourses: coursesData.length,
        totalInternships: internshipsData.length,
        bookmarkedItems: bookmarkedItems.length,
        categoriesAvailable: [...new Set([...coursesData.map(c => c.category), ...internshipsData.map(i => i.category)])].length
    };
}

// Advanced filtering (you can add this later)
function filterByMultipleCriteria(items, criteria) {
    return items.filter(item => {
        return Object.keys(criteria).every(key => {
            if (!criteria[key]) return true;
            return item[key] === criteria[key];
        });
    });
}

// Add some animation when cards appear
function animateCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
}