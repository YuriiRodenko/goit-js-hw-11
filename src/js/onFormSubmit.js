import Notiflix from 'notiflix';
import { fetchImages } from './fetchImages';
import { createMarkup } from './createMarkup';
import { err } from './err';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const target = document.querySelector('.guard');
const form = document.querySelector('.search-form');

let searchImg = '';
let observer = null;
let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
const instance = new SimpleLightbox('.gallery a');
let currentPage = 1;

export function onFormSubmit(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  const {
    elements: { searchQuery },
  } = evt.currentTarget;
  searchImg = searchQuery.value.trim();
  currentPage = 1;
  if (observer) {
    observer.unobserve(target);
  }
  if (searchImg) {
    fetchImages(searchImg, currentPage)
      .then(data => {
        if (data.total) {
          gallery.insertAdjacentHTML('beforeend', createMarkup(data));
          Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
          if (data.total > 40) {
            observer = new IntersectionObserver(onLoad, options);
            observer.observe(target);
            instance.refresh();
          }
        } else {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          const {
            elements: { searchQuery },
          } = form;
          searchQuery.value = '';
        }
      })
      .catch(err);
  }
}

function onLoad(entries, observer, searchImg) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const {
        elements: { searchQuery },
      } = form;
      searchImg = searchQuery.value.trim();
      currentPage += 1;
      fetchImages(searchImg, currentPage)
        .then(data => {
          gallery.insertAdjacentHTML('beforeend', createMarkup(data));
          instance.refresh();
          const { height: cardHeight } = document
            .querySelector('.gallery')
            .firstElementChild.getBoundingClientRect();
          window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
          });
          let totalPageImg = 40 * currentPage;
          if (totalPageImg >= data.total) {
            observer.unobserve(target);
            Notiflix.Notify.info(
              "We're sorry, but you've reached the end of search results."
            );
          }
        })
        .catch(err);
    }
  });
}