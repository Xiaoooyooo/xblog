type Handler = () => void;

let events: Handler[] = [];

export function addEvents(handler: Handler) {
  events.push(handler);
}

export function removeEvents(handler: Handler) {
  events = events.filter((e) => e !== handler);
}

document.addEventListener("click", function (e) {
  const target = e.target as HTMLElement;
  if (!target.closest(".menu")) {
    events.forEach((handler) => handler());
  }
});
