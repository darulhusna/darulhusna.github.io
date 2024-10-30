// List of image filenames
const imageList = [
  "baner1.jpg",
  "baner2.jpg",
  "vaksin.jpg"
  // Add all your image filenames here
];

// Define the interval time in milliseconds (e.g., 12000 = 12 seconds)
let slideshowInterval = 12000;

function loadImages() {
  const slideshow = document.getElementById('slideshow');
  slideshow.innerHTML = ''; // Clear existing content

  imageList.forEach(image => {
      const div = document.createElement('div');
      const img = document.createElement('img');
      img.src = `content/${image}`;
      img.alt = image;
      // img.className = 'content-image';
      img.setAttribute('style', 'object-fit: cover; width: 100%;');
      div.appendChild(img);
      slideshow.appendChild(div);
  });

  // Initialize the slideshow after images are loaded
  initializeSlideshow();
}

function initializeSlideshow() {
    $("#slideshow > div:gt(0)").hide();
    startSlideshow();
}

function startSlideshow() {
    return setInterval(function() {
        $('#slideshow > div:first')
        .fadeOut("slow")
        .next()
        .fadeIn("slow")
        .end()
        .appendTo('#slideshow');
    }, slideshowInterval);
}

// Remove the duplicate code and replace with proper initialization
$(document).ready(function() {
    $("#slideshow > div:gt(0)").hide();
    startSlideshow();
});

// Optional: Function to change the interval time
function changeInterval(newInterval) {
    slideshowInterval = newInterval;
    // Clear existing interval and restart with new time
    clearInterval(startSlideshow());
    startSlideshow();
}

var elem = document.documentElement;
const fullscreenBtn = document.querySelector('.fullscreen-btn');

function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
    // Hide the button
    fullscreenBtn.style.display = 'none';
}

function exitFullscreen() {
    const cancellFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
    cancellFullScreen.call(document);
}

var timestamp = '1728916672';

function updateTime() {
    MyDate = new Date(Date(timestamp));
    formatedTime = format_time(MyDate);
    $('#time').html(formatedTime);
    formatedDate = format_date(MyDate);
    $('#date').html(formatedDate);
    timestamp++;
}
$(function() {
    setInterval(updateTime, 1000);
});

function format_time(d) {
    nhour = d.getHours(), nmin = d.getMinutes(), nsec = d.getSeconds();
    if (nmin <= 9) nmin = "0" + nmin;
    if (nsec <= 9) nsec = "0" + nsec;
    return "" + nhour + ":" + nmin + ":" + nsec + ""
}

function format_date(d) {
    tday = new Array("Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu");
    tmonth = new Array("Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember");
    var nday = d.getDay(),
        nmonth = d.getMonth(),
        ndate = d.getDate(),
        nyear = d.getFullYear();
    return "" + tday[nday] + ", " + ndate + " " + tmonth[nmonth] + " " + nyear + ""
}

let prayerTimes = {};

function updatePrayerTimes() {
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Yogyakarta&country=ID')
        .then(response => response.json())
        .then(data => {
          if (data.data && data.data.timings) {
            prayerTimes = {
              Imsak: data.data.timings.Imsak,
              Fajr: data.data.timings.Fajr,
              Dhuhr: data.data.timings.Dhuhr,
              Asr: data.data.timings.Asr,
              Maghrib: data.data.timings.Maghrib,
              Isha: data.data.timings.Isha
            };
            displayPrayerTimes();
            console.log("Prayer times updated:", prayerTimes);
          } else {
            console.error("Unexpected response structure:", data);
          }
        })
        .catch(error => console.error("Error fetching prayer times:", error));
}

function displayPrayerTimes() {
      for (const [prayer, time] of Object.entries(prayerTimes)) {
        const element = document.getElementById(prayer);
        if (element) {
          element.textContent = time;
        } else {
          console.error(`Element with id ${prayer} not found`);
        }
    }
}

function updatePrayerTime(prayerName, time, addMinutes = 0) {
    const adjustedTime = addMinutes > 0 
        ? moment(time, 'HH:mm').add(addMinutes, 'm').format('HH:mm')
        : time;
    $(`#${prayerName}`).html(adjustedTime);
}

// Call the function to update prayer times
$(function() {
    updatePrayerTimes();
    // Update every hour (you can adjust this interval as needed)
    setInterval(updatePrayerTimes, 3600000);
});

// Load images when the page loads
document.addEventListener('DOMContentLoaded', loadImages);

function updateCountdown() {
    const now = new Date();
    let nearestPrayer = null;
    let smallestDiff = Infinity;

    for (const [prayer, time] of Object.entries(prayerTimes)) {
      const [hours, minutes] = time.split(':').map(Number);
      const prayerTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      
      if (prayerTime < now) {
        // If prayer time has passed, set it for tomorrow
        prayerTime.setDate(prayerTime.getDate() + 1);
      }

      const diff = prayerTime - now;
      if (diff < smallestDiff) {
        smallestDiff = diff;
        nearestPrayer = prayer;
      }
    }

    const hours = Math.floor(smallestDiff / (1000 * 60 * 60));
    const minutes = Math.floor((smallestDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((smallestDiff % (1000 * 60)) / 1000);

    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const prayerNameElement = document.getElementById('prayer-name');
    prayerNameElement.textContent = nearestPrayer;
}

// Update countdown every second
setInterval(updateCountdown, 1000);

// Initial call to set up countdown immediately
updateCountdown();

// Add event listener for fullscreen change
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && 
        !document.msFullscreenElement) {
        // Show the button when exiting fullscreen
        fullscreenBtn.style.display = 'block';
    }
}
