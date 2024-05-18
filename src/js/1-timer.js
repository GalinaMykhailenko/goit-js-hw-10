import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";



const startBtn = document.querySelector("button[data-start]");
const datetimePicker = document.getElementById("datetime-picker");
const timer = document.querySelector('.timer');
const daysElement = timer.querySelector('[data-days]');
const hoursElement = timer.querySelector('[data-hours]');
const minutesElement = timer.querySelector('[data-minutes]');
const secondsElement = timer.querySelector('[data-seconds]');


let userSelectedDate;
let timerInterval;


const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    checkSelectedDate();
  },
};

flatpickr(datetimePicker, options);


function checkSelectedDate() {
  const now = new Date();
  if (userSelectedDate <= now) {
    startBtn.disabled = true;
    iziToast.warning({
      title: 'Warning',
      message: 'Please choose a date in the future',
      position: 'topCenter'
    });
  } else {
    startBtn.disabled = false;
  }
}


function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}


function updateTimerDisplay(days, hours, minutes, seconds) {
  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}


function startTimer() {
  timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = userSelectedDate - now;

    if (distance <= 0) {
      clearInterval(timerInterval);
      updateTimerDisplay(0, 0, 0, 0);
      startBtn.disabled = true;
      datetimePicker.disabled = false;
      return;
    }

    const time = convertMs(distance);
    updateTimerDisplay(time.days, time.hours, time.minutes, time.seconds);
  }, 1000);
}


startBtn.addEventListener('click', function() {
  startTimer();
  startBtn.disabled = true;
  datetimePicker.disabled = true;
});


function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}