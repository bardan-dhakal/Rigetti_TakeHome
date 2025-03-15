import axios from 'axios'

const BASE_URL = "http://localhost:8000" //dummy port until backend is complete

const fetchData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/settings`)
        return response.data
    }

    catch (error) {
        console.error('Error fetching data: ', error)
        throw error
    }

}

export default fetchData;