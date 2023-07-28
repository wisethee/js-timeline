document.addEventListener("DOMContentLoaded", () => {
  const timelineContentTop = document.querySelector(
    ".timeline-history-content-top",
  );

  const timelineContentBottom = document.querySelector(
    ".timeline-history-content-bottom",
  );

  const setTimelineContentWidth = (content) => {
    const timelineContentCards = content.querySelectorAll(".timeline-card");
    const timelineContentCardsLength = timelineContentCards.length;
    const timelineContentCardWidth = 288;
    const timelineContentGap = 64;
    const timelineContentWidth =
      timelineContentCardsLength * timelineContentCardWidth +
      timelineContentGap * (timelineContentCardsLength - 1);

    content.style.width = `${timelineContentWidth}px`;
  };

  const initTimeline = () => {
    setTimelineContentWidth(timelineContentTop);
    setTimelineContentWidth(timelineContentBottom);
  };

  initTimeline();
});
