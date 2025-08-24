document.addEventListener('alpine:init', () => {
    Alpine.data('urlParams', () => {
        // Parse URL parameters
        const params = new URLSearchParams(window.location.search);

        // Return the parameters as reactive data
        return {
            todoParamId: params.get('todoId') || 'Not provided'
        }
    })
})