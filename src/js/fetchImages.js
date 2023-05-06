import axios from 'axios';
import { err } from './err';

export async function fetchImages(nameImg, page) {
  try {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '36098050-7adcb0cbd50067ceef292812e';
    let res = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${nameImg}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    let data = res.data;
    return data;
  } catch (error) {
    err(error);
  }
}