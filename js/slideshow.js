var slides = document.querySelectorAll("#slides > img");
var prev = document.getElementById("prev");
var next = document.getElementById("next");

var current = 0;

showSlides(current);        // 현재 이미지 표시
prev.onclick = prevSlides;  // 이전 이미지 표시
next.onclick = nextSlides;  // 다음 이미지 표시

function showSlides(n) {    // n번째 이미지만 화면에 표시
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[n].style.display = "block";
}

function prevSlides() {     // 이전 버튼 클릭했을 때
    if (current > 0) current -= 1;
    else current = slides.length - 1;
    showSlides(current);
}

function nextSlides() {     // 다음 버튼 클릭했을 때
    if (current < slides.length - 1) current += 1;
    else current = 0;
    showSlides(current);
}

