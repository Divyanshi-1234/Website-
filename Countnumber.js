const num = document.querySelectorAll('.count');

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            const myCount = entry.target;
            let target_count = Number(myCount.dataset.count);
            let duration = 5000;
            let startTime = null;

            const updateNumber = (currentTime) => {

                if (!startTime) {
                    startTime = currentTime;
                }

                let progress = (currentTime - startTime) / duration;

                if (progress > 1) {
                    progress = 1;
                }

                myCount.innerText = Math.floor(progress * target_count);

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                }
            };

            requestAnimationFrame(updateNumber);

           
            observer.unobserve(myCount);
        }
    });
});

num.forEach((myCount) => {
    observer.observe(myCount);
});