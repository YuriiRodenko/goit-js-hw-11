import Notiflix from 'notiflix';

export function err(error) {
  Notiflix.Notify.failure(`${error.message}`);
}