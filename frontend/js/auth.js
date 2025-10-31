/**
 * Authentication and User Info Helper
 * Include this script in pages that require authentication
 */

// Check authentication
function checkAuth() {
	const token = localStorage.getItem('authToken');
	if (!token) {
		alert('Please login to access this page');
		window.location.href = 'sign-in.html';
		return false;
	}
	return token;
}

// Fetch and update user info in header
async function updateUserInfo(token) {
	try {
		console.log('[Auth] Fetching user info with token...');
		const response = await fetch('/api/auth/profile', {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		console.log('[Auth] Response status:', response.status);

		if (!response.ok) {
			if (response.status === 401) {
				localStorage.removeItem('authToken');
				localStorage.removeItem('userEmail');
				alert('Session expired. Please login again.');
				window.location.href = 'sign-in.html';
				return null;
			}
			const errorData = await response.json();
			console.error('[Auth] Error response:', errorData);
			throw new Error(errorData.message || 'Failed to fetch user info');
		}

		const user = await response.json();
		console.log('[Auth] User data received:', user.name, user.email);
		
		// Update all user name elements
		const userNameElements = document.querySelectorAll('.user_name');
		console.log('[Auth] Found', userNameElements.length, 'user name elements');
		userNameElements.forEach(el => {
			el.innerHTML = `${user.name}<span>Active</span>`;
		});
		
		// Update all user email elements
		const userEmailElements = document.querySelectorAll('.user_email');
		console.log('[Auth] Found', userEmailElements.length, 'user email elements');
		userEmailElements.forEach(el => {
			el.textContent = user.email;
		});
		
		console.log('[Auth] User info updated successfully');
		return user;
		
	} catch (error) {
		console.error('[Auth] Error loading user info:', error);
		return null;
	}
}

// Setup logout functionality
function setupLogout() {
	const logoutLinks = document.querySelectorAll('a[href="sign-in.html"]');
	logoutLinks.forEach(link => {
		// Check if this is actually a logout link (in logout menu)
		const parent = link.closest('li');
		if (parent && parent.querySelector('img[src*="logout"]')) {
			link.addEventListener('click', function(e) {
				e.preventDefault();
				localStorage.removeItem('authToken');
				localStorage.removeItem('userEmail');
				alert('Logged out successfully!');
				window.location.href = 'sign-in.html';
			});
		}
	});
}

// Initialize authentication
function initAuth(requireAuth = true) {
	if (requireAuth) {
		const token = checkAuth();
		if (!token) return;
		
		// Update user info when DOM is loaded
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => {
				updateUserInfo(token);
				setupLogout();
			});
		} else {
			updateUserInfo(token);
			setupLogout();
		}
	} else {
		// Just setup logout if logged in
		const token = localStorage.getItem('authToken');
		if (token) {
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', () => {
					updateUserInfo(token);
					setupLogout();
				});
			} else {
				updateUserInfo(token);
				setupLogout();
			}
		}
	}
}
