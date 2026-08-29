/**
 * Which way the last chapter change went: 1 forwards, -1 backwards, 0 unknown.
 *
 * The chapter strip and the swipe handler both turn pages, but the animation
 * that plays lives in the freshly-mounted <BookChapter>, a sibling that is
 * torn down and rebuilt by the router in between. A module-level value is the
 * quietest way to carry one number across that remount; anything reactive
 * would have re-rendered the old chapter on its way out for no reason.
 *
 * A direct load or a browser back/forward leaves this at 0, which reads as
 * "no direction" and gets the neutral opening-the-book reveal instead.
 */
let direction = 0;

export function setNavDirection(d: number) {
  direction = d;
}

export function getNavDirection() {
  return direction;
}

export function clearNavDirection() {
  direction = 0;
}
