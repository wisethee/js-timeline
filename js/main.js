document.addEventListener("DOMContentLoaded", () => {
  const timeline = document.querySelector(".timeline");

  const timelineContentTop = document.querySelector(
    ".timeline-history-content-top",
  );
  const timelineContentBottom = document.querySelector(
    ".timeline-history-content-bottom",
  );

  const leftControl = document.querySelector(".timeline-controls-left");
  const rightControl = document.querySelector(".timeline-controls-right");

  // get timeline width
  const timelineWidth = timeline.offsetWidth;
  const timelineContentCardWidth = 384;

  let cardIndex = 0;

  // set timeline content width
  const setTimelineContentWidth = (content) => {
    const timelineContentCards = content.querySelectorAll(".timeline-card");
    const timelineContentCardsLength = timelineContentCards.length;

    const timelineContentWidth =
      timelineContentCardsLength * timelineContentCardWidth;
    content.style.width = `${timelineContentWidth}px`;
  };

  // init timeline
  const initTimeline = () => {
    setTimelineContentWidth(timelineContentTop);
    setTimelineContentWidth(timelineContentBottom);

    let timelineContentTopOffsetLeft = timelineContentTop.offsetLeft;
    let timelineContentBottomOffsetLeft = timelineContentBottom.offsetLeft;

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
        targetLeft += timelineWidth / 6;
        if (targetLeft > 0) targetLeft = 0;

        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(animateSlide);
        }
        if (cardIndex > 0) cardIndex--;
      }
    });

    rightControl.addEventListener("click", () => {
      if (timelineContentTopOffsetLeft >= -timelineWidth) {
        targetLeft -= timelineWidth / 6;
        if (targetLeft < -timelineWidth - timelineContentCardWidth / 2)
          targetLeft = -timelineWidth - timelineContentCardWidth / 2;
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(animateSlide);
        }
        cardIndex++;
        console.log(cardIndex);
      }
    });
  };

  initTimeline();
});
