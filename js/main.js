document.addEventListener("DOMContentLoaded", () => {
  const timeline = document.querySelector(".timeline");

  const timelineContentTop = document.querySelector(
    ".timeline-history-content-top",
  );
  const timelineContentBottom = document.querySelector(
    ".timeline-history-content-bottom",
  );

  const timelineEvents = document.querySelector(
    ".timeline-history-line-events",
  );

  const leftControl = document.querySelector(".timeline-controls-left");
  const rightControl = document.querySelector(".timeline-controls-right");

  const timelineContentCards = Array.from(
    document.querySelectorAll(".timeline-card"),
  );

  timelineContentCards.sort((a, b) => {
    const dataIdA = parseInt(a.getAttribute("data-id"));
    const dataIdB = parseInt(b.getAttribute("data-id"));
    return dataIdA - dataIdB;
  });

  // get timeline width
  const timelineWidth = timeline.offsetWidth;
  const timelineContentCardWidth = 384;
  const timelineStep = timelineContentCardWidth / 2;
  const totalCardsWidth =
    (timelineContentCards.length * timelineContentCardWidth) / 2;

  let activeCardDataId = 0;
  let timelineEventsWidth = 0;
  let timelineEventsLineWidth = 69;

  // set timeline content width
  const setTimelineContentWidth = (content) => {
    const timelineContentCards = content.querySelectorAll(".timeline-card");
    const timelineContentCardsLength = timelineContentCards.length;
    timelineEventsWidth = timelineContentCardsLength * timelineContentCardWidth;

    const timelineContentWidth = timelineEventsWidth;
    content.style.width = `${timelineContentWidth}px`;
  };

  const animateLineWidth = (element, targetWidth, duration) => {
    const startWidth = parseFloat(getComputedStyle(element).width);
    const changeInWidth = targetWidth - startWidth;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const newWidth = startWidth + changeInWidth * progress;

      element.style.width = `${newWidth}px`;

      // If the animation hasn't finished, repeat the frame
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    // Start the animation
    requestAnimationFrame(animate);
  };

  // set timeline events width
  const animateTimelineEventsWidth = (targetWidth) => {
    animateLineWidth(timelineEvents, targetWidth, 300); // Animate over 500ms
  };

  const removeActiveClass = () => {
    timelineContentCards.forEach((card) => {
      card.classList.remove("is-active");
    });
  };

  const addActiveClass = (dataId) => {
    let activeDataId;
    removeActiveClass();
    timelineContentCards.forEach((card, index) => {
      if (index === dataId) {
        card.classList.add("is-active");
        activeDataId = dataId;
      }
    });
    return activeDataId;
  };

  // init timeline
  const initTimeline = () => {
    setTimelineContentWidth(timelineContentTop);
    setTimelineContentWidth(timelineContentBottom);
    // setTimelineEventsWidth(timelineEventsLineWidth);

    let timelineContentTopOffsetLeft = timelineContentTop.offsetLeft;
    let timelineContentBottomOffsetLeft = timelineContentBottom.offsetLeft;
    let timelineEventsOffsetLeft = timelineEvents.offsetLeft;

    let targetLeft = 0;
    let animationFrameId = null;

    const animateSlide = () => {
      if (timelineContentTopOffsetLeft !== targetLeft) {
        timelineContentTopOffsetLeft +=
          (targetLeft - timelineContentTopOffsetLeft) * 0.1;
        timelineContentBottomOffsetLeft +=
          (targetLeft - timelineContentBottomOffsetLeft) * 0.1;
        timelineEventsOffsetLeft +=
          (targetLeft - timelineEventsOffsetLeft) * 0.1;

        timelineContentTop.style.left = `${timelineContentTopOffsetLeft}px`;
        timelineContentBottom.style.left = `${timelineContentBottomOffsetLeft}px`;
        timelineEvents.style.left = `${timelineEventsOffsetLeft}px`;

        animationFrameId = requestAnimationFrame(animateSlide);
      }
    };

    leftControl.addEventListener("click", () => {
      if (Math.round(timelineContentTopOffsetLeft) < 0) {
        targetLeft += timelineStep;
        if (targetLeft > 0) targetLeft = 0;

        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(animateSlide);
        }
      }
    });

    // rightControl.addEventListener("click", () => {
    //   if (timelineContentTopOffsetLeft >= -timelineWidth) {
    //     targetLeft -= timelineStep;
    //     if (targetLeft < -timelineWidth - timelineContentCardWidth / 2)
    //       targetLeft = -timelineWidth - timelineContentCardWidth / 2;
    //     if (!animationFrameId) {
    //       animationFrameId = requestAnimationFrame(animateSlide);
    //     }
    //   }
    // });

    rightControl.addEventListener("click", () => {
      if (timelineContentTopOffsetLeft > -totalCardsWidth + timelineWidth) {
        targetLeft -= timelineStep;
        if (
          targetLeft <
          -totalCardsWidth + timelineWidth - timelineContentCardWidth / 2
        )
          targetLeft =
            -totalCardsWidth + timelineWidth - timelineContentCardWidth / 2;
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(animateSlide);
        }
      }
    });

    timelineContentCards.forEach((card, index) => {
      card.addEventListener("click", () => {
        const dataId = Number(card.dataset.id);
        const newActiveCardDataId = addActiveClass(dataId);

        // Calculate the difference between the current and the clicked card
        const diff = newActiveCardDataId - activeCardDataId;

        // Update timelineEventsLineWidth
        timelineEventsLineWidth += diff * timelineStep; // Multiply with timelineStep to get the actual length
        timelineEventsLineWidth = Math.max(69, timelineEventsLineWidth); // Ensure it doesn't go below the starting width

        // Animate the change
        animateTimelineEventsWidth(timelineEventsLineWidth);

        // Update activeCardDataId
        activeCardDataId = newActiveCardDataId;
      });
    });
  };

  initTimeline();
});
