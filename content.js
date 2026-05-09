(function () {
  "use strict";

  var BUTTON_ID = "gmail-search-in-inbox-button";
  var SEARCH_SELECTOR = [
    'input[aria-label="Search mail"]',
    'input[placeholder="Search mail"]',
    'input[name="q"]',
    'form[role="search"] input[type="text"]'
  ].join(", ");

  function visible(element) {
    if (!element) {
      return false;
    }

    var box = element.getBoundingClientRect();
    return box.width > 0 && box.height > 0;
  }

  function findSearchInput() {
    var candidates = Array.prototype.slice.call(document.querySelectorAll(SEARCH_SELECTOR));

    return candidates.find(function (input) {
      return visible(input) && !input.disabled && !input.readOnly;
    }) || null;
  }

  function findSearchForm(input) {
    return input && input.closest('form[role="search"], form');
  }

  function setInputValue(input, value) {
    var descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");

    if (descriptor && descriptor.set) {
      descriptor.set.call(input, value);
    } else {
      input.value = value;
    }

    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function withInboxQualifier(query) {
    var trimmed = query.trim();

    if (/(^|\s)in:inbox(\s|$)/i.test(trimmed)) {
      return trimmed;
    }

    return trimmed ? trimmed + " in:inbox" : "in:inbox";
  }

  function submitSearch(input) {
    var form = findSearchForm(input);
    var searchButton = form && form.querySelector([
      'button[aria-label="Search mail"]',
      'button[aria-label="Search"]',
      'button[type="submit"]'
    ].join(", "));

    input.focus();

    if (searchButton) {
      searchButton.click();
      return;
    }

    input.dispatchEvent(new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "Enter",
      code: "Enter",
      which: 13,
      keyCode: 13
    }));
  }

  function searchInbox() {
    var input = findSearchInput();

    if (!input) {
      return;
    }

    setInputValue(input, withInboxQualifier(input.value));
    submitSearch(input);
  }

  function buildButton() {
    var button = document.createElement("button");
    var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var roofPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var inboxPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var flapPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

    button.id = BUTTON_ID;
    button.type = "button";
    button.className = "gmail-search-in-inbox-button";
    button.title = "Search in inbox [Ctrl+Enter]";
    button.setAttribute("aria-label", "Search in inbox [Ctrl+Enter]");

    icon.setAttribute("class", "gmail-search-in-inbox-icon");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
    roofPath.setAttribute("d", "M4.5 9.5V19h15V9.5L12 4 4.5 9.5Z");
    inboxPath.setAttribute("d", "M7.5 11.5h9v3.25a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V11.5Z");
    flapPath.setAttribute("d", "M7.5 11.5 12 14.5l4.5-3");
    icon.appendChild(roofPath);
    icon.appendChild(inboxPath);
    icon.appendChild(flapPath);

    button.appendChild(icon);
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      searchInbox();
    });

    return button;
  }

  function findMountContainer(form) {
    if (!form || !form.parentElement) {
      return null;
    }

    return form.parentElement;
  }

  function ensureMountContainer(container) {
    if (!container) {
      return;
    }

    if (window.getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
  }

  function positionButton(button, input, container) {
    var inputBox = input.getBoundingClientRect();
    var form = findSearchForm(input);
    var formBox = form ? form.getBoundingClientRect() : inputBox;
    var containerBox = container.getBoundingClientRect();
    var gap = 8;
    var topOffset = 2;
    var buttonWidth = button.offsetWidth || 62;
    var left = (formBox.right - containerBox.left) + gap;
    var maxLeft = containerBox.width - buttonWidth - gap;

    if (left > maxLeft) {
      left = Math.min((inputBox.right - containerBox.left) + gap, maxLeft);
    }

    if (left < gap) {
      left = gap;
    }

    button.style.left = Math.round(left) + "px";
    button.style.top = Math.round((formBox.top - containerBox.top) + topOffset) + "px";
    button.hidden = false;
  }

  function injectButton() {
    var input = findSearchInput();
    var form = findSearchForm(input);
    var container = findMountContainer(form);
    var button = document.getElementById(BUTTON_ID);

    if (!input) {
      if (button) {
        button.hidden = true;
      }
      return;
    }

    if (!button) {
      button = buildButton();
    }

    if (!container) {
      button.hidden = true;
      return;
    }

    ensureMountContainer(container);

    if (button.parentElement !== container) {
      container.appendChild(button);
    }

    positionButton(button, input, container);
  }

  function onKeyDown(event) {
    if (!(event.ctrlKey || event.metaKey) || event.key !== "Enter") {
      return;
    }

    var input = findSearchInput();

    if (!input || event.target !== input) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    searchInbox();
  }

  function scheduleInject() {
    window.clearTimeout(scheduleInject.timer);
    scheduleInject.timer = window.setTimeout(injectButton, 100);
  }

  document.addEventListener("keydown", onKeyDown, true);
  window.addEventListener("resize", scheduleInject);
  window.addEventListener("scroll", scheduleInject, true);
  scheduleInject();

  new MutationObserver(scheduleInject).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}());
