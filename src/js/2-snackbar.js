import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const delayInput = form.querySelector('input[name="delay"]');
  const stateInputs = form.querySelectorAll('input[name="state"]');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const delay = parseInt(delayInput.value, 10);
    const state = Array.from(stateInputs).find(input => input.checked).value;

    createPromise(delay, state)
      .then(delay => {
        iziToast.success({
          title: 'Success',
          message: `Fulfilled promise in ${delay} ms`,
          position: 'topCenter'
        });
        resetForm();
      })
      .catch(delay => {
        iziToast.error({
          title: 'Error',
          message: `Rejected promise in ${delay} ms`,
          position: 'topCenter'
        });
        resetForm();
      });
  });

  function createPromise(delay, state) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (state === 'fulfilled') {
          resolve(delay);
        } else {
          reject(delay);
        }
      }, delay);
    });
  }

  function resetForm() {
    delayInput.value = '';
    stateInputs.forEach(input => input.checked = false);
  }
});