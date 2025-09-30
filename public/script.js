// ==================== Navbar ====================
function updateActiveLink() {
  const fullUrl = window.location.pathname + window.location.hash;
  const links = document.querySelectorAll(".nav-links a");

  links.forEach(link => link.classList.remove("active"));
  let matched = false;

  links.forEach(link => {
    if (link.getAttribute("href") === fullUrl) {
      link.classList.add("active");
      matched = true;
    }
  });

  if (!matched && window.location.pathname === "/home" && window.location.hash === "") {
    const loingoLink = document.querySelector('.nav-links a[href="/home#loingo"]');
    if (loingoLink) loingoLink.classList.add("active");
  }
  if (!matched) {
    links.forEach(link => {
      if (link.getAttribute("href") === window.location.pathname) {
        link.classList.add("active");
      }
    });
  }
}

// ==================== Scroll effect ====================
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (toggle && mobileMenu) {   // kiểm tra có tồn tại
    toggle.addEventListener("click", () => {
      mobileMenu.style.display =
        mobileMenu.style.display === "flex" ? "none" : "flex";
    });
  }
});



// ==================== Slider ====================
document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".slider");

  sliders.forEach(slider => {
    const track = slider.querySelector(".slide-track");
    const slides = slider.querySelectorAll(".slide");
    const controls = slider.nextElementSibling;
    const prevBtn = controls.querySelector(".prev");
    const nextBtn = controls.querySelector(".next");

    const totalSlides = slides.length / 3; // vì có clone
    let index = 0;
    let isTransitioning = false;

    function updateSlide(noTransition = false) {
      const slideWidth = slides[0].offsetWidth;
      track.style.transition = noTransition ? "none" : "transform 0.6s ease-in-out";
      track.style.transform = `translateX(${-index * slideWidth}px)`;
    }

    track.addEventListener("transitionend", () => {
      isTransitioning = false;
      if (index >= totalSlides) {
        index = 0;
        updateSlide(true);
      } else if (index < 0) {
        index = totalSlides - 1;
        updateSlide(true);
      }
    });

    nextBtn.addEventListener("click", () => {
      if (isTransitioning) return;
      isTransitioning = true;
      index++;
      updateSlide();
    });

    prevBtn.addEventListener("click", () => {
      if (isTransitioning) return;
      isTransitioning = true;
      index--;
      updateSlide();
    });

    updateSlide();
  });
});

// ==================== Quiz logic ====================
document.addEventListener("DOMContentLoaded", () => {
  const options = document.querySelectorAll(".option");

  if (options.length > 0) {
    options.forEach(option => {
      option.addEventListener("click", () => {
        const answer = option.getAttribute("data-answer");

        let answers = JSON.parse(localStorage.getItem("quizAnswers")) || [];
        answers.push(answer);
        localStorage.setItem("quizAnswers", JSON.stringify(answers));

        const currentPath = window.location.pathname;
        const match = currentPath.match(/quiz(\d+)/);

        if (match) {
          const currentQuiz = parseInt(match[1]);
          const nextQuiz = currentQuiz + 1;

          if (currentQuiz >= 4) {
            window.location.href = "/result";
          } else {
            window.location.href = `/quiz${nextQuiz}`;
          }
        }
      });
    });
  }
});

// ==================== Result logic ====================
document.addEventListener("DOMContentLoaded", () => {
  const options = document.querySelectorAll(".option");

  // xử lý khi chọn đáp án
  options.forEach(option => {
    option.addEventListener("click", () => {
      const answer = option.getAttribute("data-answer");

      let answers = JSON.parse(localStorage.getItem("quizAnswers")) || [];
      answers.push(answer);
      localStorage.setItem("quizAnswers", JSON.stringify(answers));

      const currentPage = window.location.pathname.split("/").pop();

      if (currentPage.startsWith("quiz")) {
        const match = currentPage.match(/quiz(\d+)\.html/);
        if (match) {
          const currentQuiz = parseInt(match[1]);
          const nextQuiz = `quiz${currentQuiz + 1}.html`;

          if (currentQuiz >= 4) {
            window.location.href = "result.html";
          } else {
            window.location.href = nextQuiz;
          }
        }
      }
    });
  });

if (window.location.pathname.includes("result")) {
  const answers = JSON.parse(localStorage.getItem("quizAnswers")) || [];
  const resultDiv = document.getElementById("resultText");
  if (!resultDiv) return;

  if (answers.length === 0) {
    resultDiv.innerHTML = "Bạn chưa làm quiz nào!";
    return;
  }
    // đếm số lượng A B C D
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    answers.forEach(ans => { if (counts[ans] !== undefined) counts[ans]++; });

    const maxCount = Math.max(...Object.values(counts));
    const maxLetters = Object.keys(counts).filter(k => counts[k] === maxCount);

    let result = "";

    // mapping nội dung kết quả
    const descriptions = {
      A: `Ô ăn quan, Cờ cá ngựa, Đố Kiều<br>
      Bạn là người chiến lược và kiên nhẫn, thích những trò chơi cần đầu óc tính toán. 
      Bạn hợp với những bàn cờ, viên sỏi, hay những thử thách đòi hỏi sự thông minh và khéo léo.`,
      B: `Cướp cờ, Mèo đuổi chuột, Tó má lẹ<br>
      Bạn là người máu lửa và nhanh nhẹn, thích thử thách tốc độ và phản xạ. 
      Những trò chơi vận động, chạy nhảy, kịch tính sẽ khiến bạn tỏa sáng.`,
      C: `Rồng rắn lên mây, Đè kha (Bỏ khăn)<br>
      Bạn là người gắn kết và vui tính, luôn thích chơi cùng nhóm, tạo tiếng cười tập thể. 
      Với bạn, niềm vui quan trọng hơn thắng thua.`,
      D: `Chuyền thẻ, Ném còn<br>
      Bạn là người ngẫu hứng và thích trải nghiệm, hợp với những trò chơi bất ngờ, vui tươi, đậm chất hội hè.`
    };

    const tieDescriptions = {
      "AB": `Ô ăn quan + Cướp cờ<br>
      Bạn vừa có đầu óc chiến lược, vừa thích sự kịch tính.`,
      "AC": `Ô ăn quan + Rồng rắn lên mây<br>
      Bạn thông minh nhưng cũng ấm áp.`,
      "AD": `Đố Kiều + Ném còn<br>
      Bạn độc đáo và sáng tạo.`,
      "BC": `Cướp cờ + Đè kha<br>
      Bạn năng động và thân thiện.`,
      "BD": `Mèo đuổi chuột + Ném còn<br>
      Bạn nhanh nhẹn và hài hước.`,
      "CD": `Rồng rắn lên mây + Chuyền thẻ<br>
      Bạn vui tính và hòa đồng.`
    };

    // xử lý kết quả
    if (maxLetters.length === 1) {
      result = descriptions[maxLetters[0]];
    } else if (maxLetters.length === 2) {
      const key = maxLetters.sort().join("");
      result = tieDescriptions[key] || "Bạn có tính cách đa dạng!";
    } else if (maxLetters.length === 4) {
      result = `Bạn là “tắc kè hoa” của các trò chơi dân gian! Ở đâu có trò chơi, ở đó có bạn.`;
    } else {
      result = "Bạn có sự kết hợp thú vị giữa nhiều tính cách!";
    }

    resultDiv.innerHTML = result;
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const resetLink = document.querySelector('a[href="/quiz1"]');
  if (resetLink) {
    resetLink.addEventListener("click", () => {
      localStorage.removeItem("quizAnswers"); // xóa toàn bộ dữ liệu quiz
    });
  }
});

