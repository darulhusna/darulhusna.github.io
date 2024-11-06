// List of image filenames
const imageList = [
    "Laporan.jpg",
    "jamaah.jpg",
    "tadarus.jpg"
    // Add all your image filenames here
];

// Define the interval time in milliseconds (e.g., 12000 = 12 seconds)
let slideshowInterval = 12000;

function initializeSlideshow() {
    $("#slideshow > div:gt(0)").hide();
    let interval = startSlideshow();
    
    // Store the interval ID so we can clear it later
    return interval;
}

let currentInterval = null;

function startSlideshow() {
    // Clear any existing interval
    if (currentInterval) {
        clearInterval(currentInterval);
    }
    
    currentInterval = setInterval(function() {
        $('#slideshow > div:first')
        .fadeOut("slow")
        .next()
        .fadeIn("slow")
        .end()
        .appendTo('#slideshow');
    }, slideshowInterval);
    
    return currentInterval;
}

function loadImages() {
    const slideshow = document.getElementById('slideshow');
    if (!slideshow) {
        console.error('Slideshow element not found!');
        return;
    }
    
    slideshow.innerHTML = '';
    console.log(`Loading ${imageList.length} images...`);

    let loadedImages = 0;
    
    imageList.forEach((image, index) => {
        const div = document.createElement('div');
        const img = document.createElement('img');
        img.src = `content/${image}`;
        img.alt = image;
        img.setAttribute('style', 'object-fit: cover; width: 100%;');
        
        img.onload = () => {
            console.log(`Successfully loaded image ${index + 1}: ${image}`);
            loadedImages++;
            
            // Initialize slideshow only after all images are loaded
            if (loadedImages === imageList.length) {
                console.log('All images loaded, initializing slideshow...');
                // Clear any existing slideshow before initializing
                if (currentInterval) {
                    clearInterval(currentInterval);
                }
                initializeSlideshow();
            }
        };
        
        img.onerror = () => {
            console.error(`Failed to load image: content/${image}`);
        };

        div.appendChild(img);
        slideshow.appendChild(div);
    });
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
    
    // Add scaling calculation
    setTimeout(() => {
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const scale = Math.min(screenWidth/1366, screenHeight/768);
        
        elem.style.transform = `scale(${scale})`;
        elem.style.transformOrigin = 'top left';
    }, 100);
    
    // Hide the button
    fullscreenBtn.style.display = 'none';
}

function exitFullscreen() {
    const cancellFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
    cancellFullScreen.call(document);
}

var timestamp = '1728916672';

function updateTime() {
    let MyDate = new Date(Date(timestamp));
    let formatedTime = format_time(MyDate);
    $('#time').html(formatedTime);
    let formatedDate = format_date(MyDate);
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

            // Adjust prayer times
            updatePrayerTime('Imsak', prayerTimes.Imsak, 2);
            updatePrayerTime('Fajr', prayerTimes.Fajr, 2);
            updatePrayerTime('Dhuhr', prayerTimes.Dhuhr, 2);
            updatePrayerTime('Asr', prayerTimes.Asr, 1);
            updatePrayerTime('Maghrib', prayerTimes.Maghrib, 2);
            updatePrayerTime('Isha', prayerTimes.Isha, 2);

            // displayPrayerTimes();
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
        // Reset transform when exiting fullscreen
        elem.style.transform = 'none';
        elem.style.transformOrigin = 'initial';
        // Show the button when exiting fullscreen
        fullscreenBtn.style.display = 'block';
    }
}

