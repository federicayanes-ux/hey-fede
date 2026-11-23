(() => {
  "use strict";

  const content = window.FEDE_CONTENT;
  if (!content) {
    console.error("Website content could not be loaded. Check js/content.js.");
    return;
  }

  const STORAGE_KEY = "hey-fede-best-score";
  const state = {
    currentQuestion: 0,
    score: 0,
    answered: false,
    bestScore: readBestScore(),
    soundEnabled: false,
  };

  const backgroundMusic = content.site.backgroundMusic
    ? new Audio(content.site.backgroundMusic)
    : null;
  if (backgroundMusic) {
    backgroundMusic.loop = true;
    backgroundMusic.preload = "metadata";
    backgroundMusic.volume = Math.min(
      1,
      Math.max(0, Number(content.site.backgroundMusicVolume) || 0.24),
    );
  }

  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const one = (selector, root = document) => root.querySelector(selector);

  const elements = {
    gameIntro: one("[data-game-intro]"),
    quiz: one("[data-quiz]"),
    results: one("[data-results]"),
    currentQuestion: one("[data-current-question]"),
    liveScore: one("[data-live-score]"),
    progressTrack: one("[data-progress-track]"),
    progressBar: one("[data-progress-bar]"),
    category: one("[data-question-category]"),
    question: one("[data-question-text]"),
    answers: one("[data-answers]"),
    feedback: one("[data-feedback]"),
    nextButton: one("[data-next-question]"),
    resultScore: one("[data-result-score]"),
    resultTitle: one("[data-result-title]"),
    resultMessage: one("[data-result-message]"),
    unlockMessage: one("[data-unlock-message]"),
    memoryWall: one("[data-memory-wall]"),
    storyList: one("[data-story-list]"),
    tasteList: one("[data-taste-list]"),
    toast: one("[data-toast]"),
    memoryReader: one("[data-memory-reader]"),
    memoryReaderPage: one("[data-memory-reader-page]"),
    storyReader: one("[data-story-reader]"),
    storyReaderNumber: one("[data-story-reader-number]"),
    storyReaderTitle: one("[data-story-reader-title]"),
    storyReaderText: one("[data-story-reader-text]"),
    storyReaderTyped: one("[data-story-reader-typed]"),
    storyReaderImage: one("[data-story-reader-image]"),
    storyReaderImageSource: one("[data-story-reader-image-source]"),
    oreoRain: one("[data-oreo-rain]"),
  };

  let lastMemoryTrigger = null;
  let lastStoryTrigger = null;
  let activeStoryIndex = -1;
  let storyTypingTimer = null;

  function readBestScore() {
    const stored = Number.parseInt(localStorage.getItem(STORAGE_KEY), 10);
    return Number.isFinite(stored) ? stored : 0;
  }

  function saveBestScore(score) {
    state.bestScore = Math.max(state.bestScore, score);
    localStorage.setItem(STORAGE_KEY, String(state.bestScore));
  }

  function setText(selector, value) {
    all(selector).forEach((element) => {
      element.textContent = value;
    });
  }

  function hydrateContent() {
    setText("[data-site-intro]", content.site.intro);
    setText("[data-about-copy]", content.site.about);
    setText("[data-question-total]", String(content.questions.length).padStart(2, "0"));
    setText("[data-best-score]", String(state.bestScore).padStart(2, "0"));
    setText("[data-memory-count]", content.memories.length);
    setText("[data-current-year]", new Date().getFullYear());

    const profile = one("[data-profile-image]");
    if (content.site.profileImage) {
      profile.style.backgroundImage = `url("${content.site.profileImage}")`;
      profile.classList.add("has-image");
      profile.innerHTML = "";
    }

    renderTasteList();
    renderUnlockedContent();
  }

  function renderTasteList() {
    elements.tasteList.innerHTML = "";
    content.tastes.forEach((taste, index) => {
      const item = document.createElement("div");
      item.className = "taste-item";
      item.innerHTML = `
        <span class="taste-item__number">${String(index + 1).padStart(2, "0")}</span>
        <div><p>${escapeHTML(taste.label)}</p><strong>${escapeHTML(taste.value)}</strong></div>
      `;
      elements.tasteList.append(item);
    });
  }

  function renderUnlockedContent() {
    renderMemories();
    renderStories();
    const unlocked = content.memories.filter(
      (memory) => state.bestScore >= memory.unlockAt,
    ).length;
    setText("[data-unlocked-count]", unlocked);
    setText("[data-best-score]", String(state.bestScore).padStart(2, "0"));
  }

  function resetSavedScore() {
    if (state.bestScore === 0) {
      showToast("Your score is already at 0.");
      return;
    }

    const shouldReset = window.confirm(
      "Reset your score to 0? This will relock the scrapbook memories and stories.",
    );
    if (!shouldReset) return;

    state.bestScore = 0;
    state.score = 0;
    state.currentQuestion = 0;
    state.answered = false;
    localStorage.removeItem(STORAGE_KEY);
    elements.liveScore.textContent = "0";
    elements.resultScore.textContent = "0";
    renderUnlockedContent();
    showToast("Score reset to 0 — the archive is locked again.");
  }

  function ornateFrameMarkup() {
    return `
      <span class="memory-ornament" aria-hidden="true">
        <span class="memory-ornament__corner memory-ornament__corner--tl">❧</span>
        <span class="memory-ornament__corner memory-ornament__corner--tr">❧</span>
        <span class="memory-ornament__corner memory-ornament__corner--bl">❧</span>
        <span class="memory-ornament__corner memory-ornament__corner--br">❧</span>
        <span class="memory-ornament__crest memory-ornament__crest--top">✦</span>
        <span class="memory-ornament__crest memory-ornament__crest--bottom">✦</span>
        <span class="memory-ornament__spark memory-ornament__spark--one">✦</span>
        <span class="memory-ornament__spark memory-ornament__spark--two">✦</span>
        <span class="memory-ornament__spark memory-ornament__spark--three">✦</span>
      </span>
    `;
  }

  function renderMemories() {
    elements.memoryWall.innerHTML = "";
    content.memories.forEach((memory, index) => {
      const unlocked = state.bestScore >= memory.unlockAt;
      const article = document.createElement("article");
      article.className = `memory-card memory-card--${memory.color || "coral"}${
        unlocked ? " is-unlocked" : " is-locked"
      }`;
      article.style.setProperty("--card-index", index);

      const imagePosition = escapeAttribute(memory.imagePosition || "center");
      const imageFit = escapeAttribute(memory.imageFit || "cover");
      const image = memory.image
        ? `<img src="${escapeAttribute(memory.image)}" alt="" loading="lazy" style="object-fit: ${imageFit}; object-position: ${imagePosition}" />`
        : `<div class="memory-placeholder"><span>PHOTO ${String(index + 1).padStart(2, "0")}</span></div>`;

      const hasDetailPage = unlocked && memory.hasDetailPage !== false;
      const cardCaption = unlocked
        ? memory.caption
          ? `<p>${escapeHTML(memory.caption)}</p>`
          : ""
        : "<p>Play the quiz to bring this one into focus.</p>";
      const photo = hasDetailPage
        ? `<button class="memory-card__open" type="button" data-memory-index="${index}" aria-label="Open ${escapeAttribute(memory.title)}">
            ${image}
            <span class="memory-card__open-label">Open memory <span aria-hidden="true">↗</span></span>
          </button>`
        : image;

      article.innerHTML = `
        <div class="memory-card__photo">${photo}${ornateFrameMarkup()}</div>
        <div class="memory-card__copy">
          <p class="memory-card__status">${
            unlocked ? "UNLOCKED" : `SCORE ${memory.unlockAt} TO OPEN`
          }</p>
          <h3>${unlocked ? escapeHTML(memory.title) : "Classified memory"}</h3>
          ${cardCaption}
        </div>
        ${unlocked ? "" : '<span class="memory-lock" aria-hidden="true">✦</span>'}
      `;
      if (hasDetailPage) {
        one("[data-memory-index]", article).addEventListener("click", (event) => {
          openMemory(index, event.currentTarget);
        });
      }
      elements.memoryWall.append(article);
    });
  }

  function openMemory(index, trigger) {
    const memory = content.memories[index];
    if (!memory || state.bestScore < memory.unlockAt || !elements.memoryReader) return;

    lastMemoryTrigger = trigger;
    const gallery = Array.isArray(memory.gallery) ? memory.gallery.slice(0, 4) : ["", ""];

    const mainPhoto = memory.image
      ? `<img src="${escapeAttribute(memory.image)}" alt="${escapeAttribute(memory.title)}" style="object-fit: ${escapeAttribute(memory.imageFit || "cover")}; object-position: ${escapeAttribute(memory.imagePosition || "center")}" />`
      : `<div class="memory-reader__photo-placeholder"><span>MAIN PHOTO</span><strong>${String(index + 1).padStart(2, "0")}</strong></div>`;

    const galleryPhotos = gallery
      .map((galleryItem, galleryIndex) => {
        const isVideo = typeof galleryItem === "object" && galleryItem?.type === "video";
        const mediaPath = typeof galleryItem === "string" ? galleryItem : galleryItem?.src;
        if (!mediaPath) {
          return `<div class="memory-reader__gallery-placeholder"><span>ADD PHOTO</span><strong>${String(galleryIndex + 1).padStart(2, "0")}</strong></div>`;
        }
        if (isVideo) {
          return `<figure class="memory-reader__gallery-photo memory-reader__gallery-video">
            <video autoplay muted loop playsinline preload="auto" disablepictureinpicture aria-label="Video from ${escapeAttribute(memory.title)}">
              <source src="${escapeAttribute(mediaPath)}" type="video/mp4" />
            </video>
          </figure>`;
        }
        return `<figure class="memory-reader__gallery-photo"><img src="${escapeAttribute(mediaPath)}" alt="More from ${escapeAttribute(memory.title)}" /></figure>`;
      })
      .join("");

    const caption = memory.caption
      ? `<p class="memory-reader__caption">${escapeHTML(memory.caption)}</p>`
      : "";

    elements.memoryReaderPage.className = `memory-reader__page${
      memory.wideGallery || gallery.length >= 3 ? " has-wide-gallery" : ""
    } media-count-${gallery.length}`;

    elements.memoryReaderPage.innerHTML = `
      <div class="memory-reader__visual">
        <div class="memory-reader__main-photo">${mainPhoto}${ornateFrameMarkup()}</div>
        <p class="memory-reader__photo-note">Memory ${String(index + 1).padStart(2, "0")} · unlocked</p>
      </div>
      <div class="memory-reader__story">
        <p class="memory-reader__kicker">FROM THE FEDE ARCHIVE</p>
        <h2 id="memory-reader-title">${escapeHTML(memory.title)}</h2>
        ${caption}
        <div class="memory-reader__rule" aria-hidden="true"></div>
        <p class="memory-reader__details">${escapeHTML(memory.details || memory.caption)}</p>
      </div>
      <div class="memory-reader__gallery" aria-label="More photos from this memory">
        ${galleryPhotos}
      </div>
    `;

    elements.memoryReader.hidden = false;
    document.body.classList.add("memory-reader-open");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        elements.memoryReader.classList.add("is-open");
        window.setTimeout(
          () => one("[data-close-memory]", elements.memoryReader)?.focus(),
          prefersReducedMotion() ? 0 : 520,
        );
      });
    });
  }

  function closeMemory() {
    if (!elements.memoryReader || elements.memoryReader.hidden) return;
    elements.memoryReader.classList.remove("is-open");
    document.body.classList.remove("memory-reader-open");

    window.setTimeout(
      () => {
        elements.memoryReader.hidden = true;
        elements.memoryReaderPage.innerHTML = "";
        lastMemoryTrigger?.focus();
      },
      prefersReducedMotion() ? 0 : 620,
    );
  }

  function renderStories() {
    elements.storyList.innerHTML = "";
    content.stories.forEach((story, index) => {
      const unlocked = state.bestScore >= story.unlockAt;
      const article = document.createElement(unlocked ? "button" : "article");
      article.className = `story-item${unlocked ? " is-unlocked story-item--open" : " is-locked"}`;
      if (unlocked) {
        article.type = "button";
        article.setAttribute(
          "aria-label",
          `Open story ${story.number}: ${story.listTitle || story.title}`,
        );
      }
      article.innerHTML = `
        <span class="story-item__number">${escapeHTML(story.number)}</span>
        <div>
          <p class="story-item__label">${unlocked ? escapeHTML(story.listLabel || "OPEN STORY") : `CLASSIFIED — SCORE ${story.unlockAt}`}</p>
          <h3>${unlocked ? escapeHTML(story.listTitle || story.title) : "This page is still under wraps"}</h3>
          <p>${unlocked ? escapeHTML(story.teaser || "There is more to this one than the title gives away.") : "Get a few more answers right and I’ll tell you everything."}</p>
        </div>
        <span class="story-item__mark" aria-hidden="true">${unlocked ? "↗" : "×"}</span>
      `;
      if (unlocked) {
        article.addEventListener("click", () => openStory(index, article));
      }
      elements.storyList.append(article);
    });
  }

  function stopStoryTyping() {
    if (storyTypingTimer) {
      window.clearTimeout(storyTypingTimer);
      storyTypingTimer = null;
    }
  }

  function finishStoryTyping() {
    const story = content.stories[activeStoryIndex];
    if (!story || !elements.storyReaderTitle || !elements.storyReaderTyped) return;
    stopStoryTyping();
    elements.storyReaderTitle.textContent = story.title;
    elements.storyReaderTyped.textContent = story.text;
    elements.storyReader?.classList.add("typing-complete");
  }

  function typeStory(story) {
    stopStoryTyping();
    elements.storyReader?.classList.remove("typing-complete");
    elements.storyReaderTitle.textContent = "";
    elements.storyReaderTyped.textContent = "";

    if (prefersReducedMotion()) {
      finishStoryTyping();
      return;
    }

    let titlePosition = 0;
    let textPosition = 0;
    const typeNext = () => {
      if (titlePosition < story.title.length) {
        titlePosition += 1;
        elements.storyReaderTitle.textContent = story.title.slice(0, titlePosition);
        storyTypingTimer = window.setTimeout(typeNext, 44);
        return;
      }

      if (textPosition < story.text.length) {
        const character = story.text[textPosition];
        textPosition += 1;
        elements.storyReaderTyped.textContent = story.text.slice(0, textPosition);
        const pause = /[.!?]/.test(character) ? 145 : /[,;:]/.test(character) ? 70 : 22;
        storyTypingTimer = window.setTimeout(typeNext, pause);
        return;
      }

      storyTypingTimer = null;
      elements.storyReader?.classList.add("typing-complete");
    };

    typeNext();
  }

  function clearOreoRain() {
    if (!elements.oreoRain) return;
    elements.oreoRain.classList.remove("is-active");
    elements.oreoRain.replaceChildren();
  }

  function startOreoRain() {
    if (!elements.oreoRain) return;
    clearOreoRain();

    const isSmallScreen = window.innerWidth < 640;
    const cookieCount = isSmallScreen ? 22 : 30;
    const cookies = Array.from({ length: cookieCount }, (_, index) => {
      const cookie = document.createElement("span");
      cookie.className = "oreo-cookie";
      const rowPosition = 1.5 + (index / (cookieCount - 1)) * 97;
      const baseSize = isSmallScreen ? 1.65 : 2.05;
      cookie.style.setProperty("--oreo-left", `${rowPosition}%`);
      cookie.style.setProperty("--oreo-size", `${baseSize + (index % 4) * 0.16}rem`);
      cookie.style.setProperty("--oreo-delay", `${(index % 10) * 0.1}s`);
      cookie.style.setProperty("--oreo-duration", `${1.75 + (index % 5) * 0.13}s`);
      cookie.style.setProperty("--oreo-spin", `${280 + (index % 6) * 95}deg`);
      cookie.style.setProperty("--oreo-stack", "0rem");
      cookie.style.setProperty("--oreo-tilt", `${-18 + (index % 7) * 6}deg`);
      return cookie;
    });

    elements.oreoRain.append(...cookies);
    window.requestAnimationFrame(() => elements.oreoRain.classList.add("is-active"));
  }

  function openStory(index, trigger) {
    const story = content.stories[index];
    if (!story || state.bestScore < story.unlockAt || !elements.storyReader) return;

    activeStoryIndex = index;
    lastStoryTrigger = trigger;
    elements.storyReaderNumber.textContent = `STORY ${story.number}`;
    elements.storyReaderTitle.setAttribute("aria-label", story.title);
    elements.storyReaderText.setAttribute("aria-label", story.text);
    if (elements.storyReaderImage && elements.storyReaderImageSource) {
      if (story.image) {
        elements.storyReaderImageSource.src = story.image;
        elements.storyReaderImageSource.alt = story.imageAlt || "";
        elements.storyReaderImage.hidden = false;
      } else {
        elements.storyReaderImage.hidden = true;
        elements.storyReaderImageSource.removeAttribute("src");
        elements.storyReaderImageSource.alt = "";
      }
    }
    elements.storyReader.hidden = false;
    document.body.classList.add("story-reader-open");

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        elements.storyReader.classList.add("is-open");
        typeStory(story);
        if (index === 2 && !prefersReducedMotion()) {
          startOreoRain();
        } else {
          clearOreoRain();
        }
        window.setTimeout(
          () => one("[data-close-story]", elements.storyReader)?.focus(),
          prefersReducedMotion() ? 0 : 380,
        );
      });
    });
  }

  function closeStory() {
    if (!elements.storyReader || elements.storyReader.hidden) return;
    stopStoryTyping();
    clearOreoRain();
    elements.storyReader.classList.remove("is-open", "typing-complete");
    document.body.classList.remove("story-reader-open");

    window.setTimeout(
      () => {
        elements.storyReader.hidden = true;
        elements.storyReaderTitle.textContent = "";
        elements.storyReaderTyped.textContent = "";
        if (elements.storyReaderImage && elements.storyReaderImageSource) {
          elements.storyReaderImage.hidden = true;
          elements.storyReaderImageSource.removeAttribute("src");
          elements.storyReaderImageSource.alt = "";
        }
        activeStoryIndex = -1;
        lastStoryTrigger?.focus();
      },
      prefersReducedMotion() ? 0 : 420,
    );
  }

  function beginQuiz() {
    state.currentQuestion = 0;
    state.score = 0;
    state.answered = false;
    elements.gameIntro.hidden = true;
    elements.results.hidden = true;
    elements.quiz.hidden = false;
    renderQuestion();
    elements.quiz.focus?.();
  }

  function renderQuestion() {
    const item = content.questions[state.currentQuestion];
    state.answered = false;

    elements.currentQuestion.textContent = state.currentQuestion + 1;
    elements.liveScore.textContent = state.score;
    elements.category.textContent = item.category;
    elements.question.textContent = item.question;
    elements.feedback.textContent = "";
    elements.feedback.className = "feedback";
    elements.nextButton.hidden = true;
    elements.answers.innerHTML = "";

    const progress = (state.currentQuestion / content.questions.length) * 100;
    elements.progressBar.style.width = `${progress}%`;
    elements.progressTrack.setAttribute("aria-valuenow", String(Math.round(progress)));

    item.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.innerHTML = `<span>${String.fromCharCode(65 + index)}</span>${escapeHTML(answer)}`;
      button.addEventListener("click", () => chooseAnswer(index, button));
      elements.answers.append(button);
    });
  }

  function chooseAnswer(index, selectedButton) {
    if (state.answered) return;
    state.answered = true;

    const item = content.questions[state.currentQuestion];
    const isCorrect = index === item.correctAnswer;
    if (isCorrect) state.score += 1;

    all(".answer-button", elements.answers).forEach((button, buttonIndex) => {
      button.disabled = true;
      if (buttonIndex === item.correctAnswer) button.classList.add("is-correct");
      if (button === selectedButton && !isCorrect) button.classList.add("is-wrong");
    });

    elements.liveScore.textContent = state.score;
    elements.feedback.classList.add(isCorrect ? "is-correct" : "is-wrong");
    elements.feedback.innerHTML = `<strong>${isCorrect ? "Correct!" : "Not this time."}</strong> ${escapeHTML(item.fact)}`;
    if (isCorrect) {
      showCorrectCelebration();
    } else {
      showWrongCelebration();
    }
    elements.nextButton.hidden = false;
    elements.nextButton.focus();
    playTone(isCorrect ? 640 : 190);
  }

  function showCorrectCelebration() {
    const celebration = one("[data-correct-celebration]");
    const confetti = one("[data-correct-confetti]");
    if (!celebration || !confetti || prefersReducedMotion()) return;

    window.clearTimeout(showCorrectCelebration.timer);
    celebration.classList.remove("is-active");
    confetti.innerHTML = "";

    const colors = ["#ffd84c", "#ff6b63", "#e84fa8", "#754cff", "#48cbd0", "#d7ef70"];
    for (let index = 0; index < 42; index += 1) {
      const piece = document.createElement("span");
      const angle = (Math.PI * 2 * index) / 42 + (Math.random() - 0.5) * 0.22;
      const distance = 150 + Math.random() * 340;
      piece.className = "confetti-piece";
      piece.style.setProperty("--confetti-x", `${Math.cos(angle) * distance}px`);
      piece.style.setProperty("--confetti-y", `${Math.sin(angle) * distance + 70}px`);
      piece.style.setProperty("--confetti-rotation", `${360 + Math.random() * 720}deg`);
      piece.style.setProperty("--confetti-delay", `${Math.random() * 130}ms`);
      piece.style.setProperty("--confetti-color", colors[index % colors.length]);
      confetti.append(piece);
    }

    void celebration.offsetWidth;
    celebration.classList.add("is-active");
    showCorrectCelebration.timer = window.setTimeout(() => {
      celebration.classList.remove("is-active");
      confetti.innerHTML = "";
    }, 1650);
  }

  function showWrongCelebration() {
    const celebration = one("[data-wrong-celebration]");
    const shards = one("[data-wrong-shards]");
    if (!celebration || !shards || prefersReducedMotion()) return;

    window.clearTimeout(showWrongCelebration.timer);
    celebration.classList.remove("is-active");
    shards.innerHTML = "";

    const colors = ["#ff6b63", "#e84fa8", "#754cff", "#ff9f45", "#ffd15a"];
    for (let index = 0; index < 30; index += 1) {
      const shard = document.createElement("span");
      const angle = (Math.PI * 2 * index) / 30 + (Math.random() - 0.5) * 0.3;
      const distance = 130 + Math.random() * 300;
      shard.className = "wrong-shard";
      shard.style.setProperty("--shard-x", `${Math.cos(angle) * distance}px`);
      shard.style.setProperty("--shard-y", `${Math.sin(angle) * distance + 55}px`);
      shard.style.setProperty("--shard-rotation", `${180 + Math.random() * 540}deg`);
      shard.style.setProperty("--shard-delay", `${Math.random() * 100}ms`);
      shard.style.setProperty("--shard-color", colors[index % colors.length]);
      shards.append(shard);
    }

    void celebration.offsetWidth;
    celebration.classList.add("is-active");
    showWrongCelebration.timer = window.setTimeout(() => {
      celebration.classList.remove("is-active");
      shards.innerHTML = "";
    }, 1450);
  }

  function nextQuestion() {
    if (state.currentQuestion < content.questions.length - 1) {
      state.currentQuestion += 1;
      renderQuestion();
      elements.question.focus?.();
    } else {
      showResults();
    }
  }

  function showResults() {
    saveBestScore(state.score);
    elements.quiz.hidden = true;
    elements.results.hidden = false;
    elements.resultScore.textContent = state.score;

    const ratio = state.score / content.questions.length;
    let title = "We have some catching up to do!";
    let message = "A brave attempt. The good news: now you have an excuse to ask Fede more questions.";
    if (ratio >= 0.85) {
      title = "Certified Fede expert!";
      message = "You know the deep cuts. Take a bow and enjoy everything you just unlocked.";
    } else if (ratio >= 0.5) {
      title = "Friend credentials confirmed.";
      message = "You know your way around the Fede universe, with a few mysteries left to solve.";
    }

    elements.resultTitle.textContent = title;
    elements.resultMessage.textContent = message;
    const unlocked = content.memories.filter((memory) => state.bestScore >= memory.unlockAt).length;
    elements.unlockMessage.textContent = `${unlocked} of ${content.memories.length} scrapbook memories are now open.`;

    renderUnlockedContent();
    elements.results.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
  }

  async function shareResult() {
    const text = `I scored ${state.score}/${content.questions.length} on Hey, Fede! Think you know her better?`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Hey, Fede!", text, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        showToast("Result copied — ready to paste!");
        setText("[data-share-label]", "Copied!");
      }
    } catch (error) {
      if (error.name !== "AbortError") showToast("Could not share. Try copying the page link.");
    }
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.hidden = false;
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      elements.toast.hidden = true;
    }, 2600);
  }

  async function toggleSound(button) {
    state.soundEnabled = !state.soundEnabled;
    button.setAttribute("aria-pressed", String(state.soundEnabled));
    setText("[data-sound-label]", state.soundEnabled ? "Music on" : "Music off");

    if (!backgroundMusic) {
      if (state.soundEnabled) playTone(440);
      return;
    }

    if (state.soundEnabled) {
      try {
        await backgroundMusic.play();
        playTone(440);
        showToast(`${content.site.backgroundMusicLabel || "Music"} on ♪`);
      } catch (error) {
        state.soundEnabled = false;
        button.setAttribute("aria-pressed", "false");
        setText("[data-sound-label]", "Music off");
        showToast("The music could not start. Try the button again.");
      }
    } else {
      backgroundMusic.pause();
    }
  }

  function playTone(frequency) {
    if (!state.soundEnabled) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.08, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.16);
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function enablePointerDepth() {
    const hero = one(".hero");
    const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!hero || !precisePointer || prefersReducedMotion()) return;

    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      hero.style.setProperty("--spot-x", `${(x * 100).toFixed(1)}%`);
      hero.style.setProperty("--spot-y", `${(y * 100).toFixed(1)}%`);
      hero.style.setProperty("--tilt-x", `${((0.5 - y) * 3.2).toFixed(2)}deg`);
      hero.style.setProperty("--tilt-y", `${((x - 0.5) * 4.2).toFixed(2)}deg`);
    });

    hero.addEventListener("pointerleave", () => {
      hero.style.setProperty("--spot-x", "50%");
      hero.style.setProperty("--spot-y", "42%");
      hero.style.setProperty("--tilt-x", "0deg");
      hero.style.setProperty("--tilt-y", "0deg");
    });
  }

  function enableHeroScrollLights() {
    const hero = one(".hero");
    if (!hero || prefersReducedMotion()) return;

    let frameRequested = false;
    const updateLights = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight));
      hero.style.setProperty("--beam-opacity", (0.46 + progress * 0.34).toFixed(2));
      hero.style.setProperty("--beam-drift", `${(progress * 6).toFixed(2)}rem`);
      frameRequested = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (frameRequested) return;
        frameRequested = true;
        window.requestAnimationFrame(updateLights);
      },
      { passive: true },
    );
    updateLights();
  }

  function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = String(value);
    return div.innerHTML;
  }

  function escapeAttribute(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  }

  all("[data-start-game]").forEach((button) =>
    button.addEventListener("click", () => {
      window.setTimeout(beginQuiz, 250);
    }),
  );
  one("[data-begin-quiz]").addEventListener("click", beginQuiz);
  elements.nextButton.addEventListener("click", nextQuestion);
  one("[data-replay]").addEventListener("click", beginQuiz);
  one("[data-share-result]").addEventListener("click", shareResult);
  one("[data-reset-score]")?.addEventListener("click", resetSavedScore);
  one("[data-sound-toggle]").addEventListener("click", (event) => toggleSound(event.currentTarget));
  all("[data-close-memory]").forEach((button) => button.addEventListener("click", closeMemory));
  all("[data-close-story]").forEach((button) => button.addEventListener("click", closeStory));
  one("[data-skip-story]")?.addEventListener("click", finishStoryTyping);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && elements.memoryReader && !elements.memoryReader.hidden) {
      closeMemory();
    } else if (event.key === "Escape" && elements.storyReader && !elements.storyReader.hidden) {
      closeStory();
    }
  });

  hydrateContent();
  enablePointerDepth();
  enableHeroScrollLights();
})();
