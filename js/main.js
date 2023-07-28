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
  const timelineStep = timelineWidth / 6;
  const timelineContentCardWidth = 384;

  let cardIndex = 0;
  let timelineEventsWidth = 0;

  const removeActiveClass = () => {
    timelineContentCards.forEach((card) => {
      card.classList.remove("is-active");
    });
  };

  const addActiveClass = (dataId) => {
    removeActiveClass();
    timelineContentCards.forEach((card, index) => {
      if (index <= dataId) {
        card.classList.add("is-active");
        cardIndex = dataId;
      }
    });
  };

  // set timeline content width
  const setTimelineContentWidth = (content) => {
    const timelineContentCards = content.querySelectorAll(".timeline-card");
    const timelineContentCardsLength = timelineContentCards.length;
    timelineEventsWidth = timelineContentCardsLength * timelineContentCardWidth;

    const timelineContentWidth = timelineEventsWidth;
    content.style.width = `${timelineContentWidth}px`;
  };

  // set timeline events width
  const setTimelineEventsWidth = () => {
    timelineEvents.style.width = `${69}px`;
  };

  // init timeline
  const initTimeline = () => {
    setTimelineContentWidth(timelineContentTop);
    setTimelineContentWidth(timelineContentBottom);
    // setTimelineEventsWidth();

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

        timelineContentTop.style.left = `${timelineContentTopOffsetLeft}px`;
        timelineContentBottom.style.left = `${timelineContentBottomOffsetLeft}px`;

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
        // if (cardIndex > 0) cardIndex--;
        // addActiveClass(cardIndex);
      }
    });

    rightControl.addEventListener("click", () => {
      if (timelineContentTopOffsetLeft >= -timelineWidth) {
        targetLeft -= timelineStep;
        if (targetLeft < -timelineWidth - timelineContentCardWidth / 2)
          targetLeft = -timelineWidth - timelineContentCardWidth / 2;
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(animateSlide);
        }
        // cardIndex++;
        // addActiveClass(cardIndex);
      }
    });

    timelineContentCards.forEach((card, index) => {
      card.addEventListener("click", () => {
        const dataId = Number(card.dataset.id);
        addActiveClass(dataId);
      });
    });
  };

  initTimeline();
});
