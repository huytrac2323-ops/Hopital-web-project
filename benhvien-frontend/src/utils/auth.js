// A utility function to get the authentication token from localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};

// A utility function to create authenticated headers for API requests
export const getAuthHeaders = () => {
    const token = getToken();
    console.log('Auth Headers - Retrieved Token:', token ? 'Token exists' : 'No token found'); // Thêm dòng này để debug
    if (token) {
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }
    return {
        'Content-Type': 'application/json'
    };
};