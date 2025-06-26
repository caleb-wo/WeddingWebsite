const countdownManager = () =>{
    const countdown = document.querySelector("#countdown-display");
    const now = new Date();
    const august1st = new Date(now.getFullYear(), 7, 1, 0,0,0); // Gets august first. Trailing 0's are hours, minutes, and seconds.

    const difference = august1st - now;

    // Get elements for days, hours, minutes, and seconds
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if ( difference < 0 ){
        countdown.innerHTML = "Countdown Completed. Caleb and Mary have been married!";
    } else {
        const formattedDays = String(days).padStart(2, '0');
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        countdown.innerHTML = `${formattedDays}d ${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s `;
    }

}
countdownManager();

setInterval(countdownManager, 1000);