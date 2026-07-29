const API_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1`
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function request(endpoint, options = {}) {
    const { headers = {}, ...rest } = options

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...rest,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            apikey: API_KEY,
            ...headers,
        },
    })

    const data =
        response.status === 204 ? null : await response.json()

    if (!response.ok) {
        throw new Error(
            data?.message ||
            data?.error ||
            `Request failed with status ${response.status}`
        )
    }

    return data
}

export const apiClient = {

    get(endpoint) {
        return request(endpoint)
    },

    post(endpoint, data, options = {}) {
        return request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options,
        })
    },

    patch(endpoint, data, options = {}) {
        return request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
            ...options,
        })
    },

    delete(endpoint, options = {}) {
        return request(endpoint, {
            method: 'DELETE',
            ...options,
        })
    }
}