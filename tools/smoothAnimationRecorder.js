/**
 * Smooth-animation DOM recorder.
 *
 * Records the lifecycle of every element the SmoothManager animates, so intermittent
 * streaming-animation bugs can be caught on production and analysed afterwards.
 *
 * The animation is driven entirely by two classes and two inline styles:
 *   .chat-ui-markdown-smooth-pending    -> opacity: 0, waiting to be picked up
 *   .chat-ui-markdown-smooth-animating  -> fade-in running, with style.animationDelay
 *   style.opacity = '1'                 -> SmoothManager's cleanup, element is final
 * so the transitions between those states are the whole story.
 *
 * Usage - paste this file into the DevTools console, or keep it as a DevTools Snippet
 * (Sources -> Snippets -> New) so it survives reloads:
 *
 *   __smoothRec.start()          // begin recording, then reproduce the bug
 *   __smoothRec.report()         // summary of the anomalies found so far
 *   __smoothRec.save()           // download the full timeline as JSON
 *   __smoothRec.stop()
 *
 * Options: __smoothRec.start({ stuckMs: 8000, idleMs: 2000, quiet: false, maxEvents: 50000 })
 *   stuckMs   how long an element may stay pending before it counts as stuck. Must be
 *             larger than the configured fade-in duration, since SmoothManager holds its
 *             `running` lock for `stagger + fade-in` ms and defers any pending element
 *             that shows up meanwhile.
 *   idleMs    how long the chat DOM must be quiet before stuck elements are reported. A
 *             pending element is perfectly normal mid-stream; it is only a bug when the
 *             stream has stopped and the text is still invisible.
 *   quiet     record only anomalies, not the full timeline (much smaller dumps)
 *   maxEvents hard cap so a long session cannot exhaust memory
 */
(function () {
  var CLASS_ROOT = 'chat-ui-message-assistant-root';
  var CLASS_PENDING = 'chat-ui-markdown-smooth-pending';
  var CLASS_ANIMATING = 'chat-ui-markdown-smooth-animating';

  var state = null;

  var label = function (el) {
    var text = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    return el.tagName.toLowerCase() + (text ? ' "' + text + '"' : '');
  };

  // Index of this element among its siblings, walked up to the message root - enough to
  // find the node again in a saved dump.
  var pathOf = function (el) {
    var parts = [];
    var node = el;
    while (node && node.parentElement && !node.classList.contains(CLASS_ROOT)) {
      parts.unshift(Array.prototype.indexOf.call(node.parentElement.children, node));
      node = node.parentElement;
    }
    return parts.join('/');
  };

  var inChat = function (el) {
    return !!(el && el.closest && el.closest('.' + CLASS_ROOT));
  };

  var trackOf = function (el) {
    var track = state.tracks.get(el);
    if (track) return track;

    track = {
      id: state.nextId++,
      label: label(el),
      path: pathOf(el),
      firstSeenAt: state.now(),
      pendingSince: null,
      animateCount: 0,
      cleanedAt: null,
      textAtCleanup: null,
      textSwaps: 0,
      anomalies: [],
    };
    state.tracks.set(el, track);
    state.tracked.push({ el: el, track: track });
    return track;
  };

  var push = function (type, track, extra) {
    if (state.events.length >= state.options.maxEvents) return;

    var event = { t: state.now(), type: type, id: track.id, label: track.label };
    if (extra) Object.keys(extra).forEach(function (key) { event[key] = extra[key]; });
    state.events.push(event);
  };

  var anomaly = function (track, kind, detail) {
    // One report per kind per element, so a stuck node does not flood the watchdog log.
    if (track.anomalies.indexOf(kind) !== -1) return;

    track.anomalies.push(kind);
    state.anomalies.push({
      t: state.now(),
      kind: kind,
      id: track.id,
      label: track.label,
      path: track.path,
      detail: detail,
    });
    if (!state.options.silent) console.warn('[smoothRec] ' + kind + ' - ' + track.label, detail || '');
  };

  var classAttrOf = function (el) {
    return el.getAttribute('class') || '';
  };

  var onClassTransition = function (el, oldValue, newValue) {
    var track = trackOf(el);
    var was = oldValue.split(/\s+/);
    var now = newValue.split(/\s+/);

    var hadPending = was.indexOf(CLASS_PENDING) !== -1;
    var hasPending = now.indexOf(CLASS_PENDING) !== -1;
    var hadAnimating = was.indexOf(CLASS_ANIMATING) !== -1;
    var hasAnimating = now.indexOf(CLASS_ANIMATING) !== -1;

    if (!hadPending && hasPending) {
      track.pendingSince = state.now();
      if (!state.options.quiet) push('pending', track, { path: track.path });

      // The cleanup sets style.opacity = '1' precisely so a re-applied pending class cannot
      // hide a finished element. If that inline style is missing, the element goes invisible.
      if (track.cleanedAt !== null && el.style.opacity !== '1') {
        anomaly(
          track,
          'repending-without-opacity',
          'pending re-applied after cleanup, inline opacity="' + el.style.opacity + '"'
        );
      }
    }

    if (!hadAnimating && hasAnimating) {
      track.animateCount += 1;
      track.pendingSince = null;
      if (!state.options.quiet) push('animate', track, { delay: el.style.animationDelay, n: track.animateCount });
      if (track.animateCount > 1) {
        anomaly(track, 'reanimated', 'element faded in ' + track.animateCount + ' times (flicker)');
      }
    }

    if (hadAnimating && !hasAnimating) {
      track.cleanedAt = state.now();
      track.textAtCleanup = el.textContent;
      if (!state.options.quiet) push('cleanup', track, { opacity: el.style.opacity });
    }
  };

  // The word spans are keyed by their position inside the block, so when a late chunk closes
  // a `**` or a link the inline nodes are rebuilt and the positions shift. React then hands
  // an already-faded-in span a different word: the node keeps its inline opacity:1, so the
  // new word is on screen instantly with no fade at all, while its neighbours that did get
  // fresh nodes fade in normally. That is the interleaving of solid and pale text.
  var onTextChange = function (el) {
    if (!el || el.nodeType !== 1 || !inChat(el)) return;
    if (!state.tracks.has(el)) return;

    var track = state.tracks.get(el);

    if (track.cleanedAt === null) return;

    var next = el.textContent;

    if (next === track.textAtCleanup) return;

    track.textSwaps += 1;
    if (!state.options.quiet) {
      push('textswap', track, { from: track.textAtCleanup, to: next, n: track.textSwaps });
    }
    anomaly(
      track,
      'text-swapped-after-fade',
      'node reused for new text ' + JSON.stringify(track.textAtCleanup) + ' -> ' + JSON.stringify(next)
        + ' after it had already faded in, so the new text never animates'
    );
    track.textAtCleanup = next;
  };

  var onMutation = function (records) {
    state.lastMutationAt = state.now();

    // MutationObserver delivers a whole batch at once and never reports the *new* attribute
    // value, so reading el.classList here would only ever see the end state of the batch —
    // which turns one `remove(pending) + add(animating)` pair into two fake fade-ins. The
    // real states are the chain of oldValues per element, terminated by the live value.
    var classHistory = new Map();

    records.forEach(function (record) {
      if (record.type === 'attributes') {
        if (record.attributeName !== 'class') return;
        if (record.target.nodeType !== 1 || !inChat(record.target)) return;

        var history = classHistory.get(record.target);

        if (!history) {
          history = [];
          classHistory.set(record.target, history);
        }
        history.push(record.oldValue || '');
        return;
      }

      if (record.type === 'characterData') {
        onTextChange(record.target.parentElement);
        return;
      }

      if (record.type !== 'childList') return;

      // A text node swapped wholesale rather than edited in place lands here.
      onTextChange(record.target);

      Array.prototype.forEach.call(record.addedNodes, function (node) {
        if (node.nodeType !== 1 || !inChat(node)) return;

        var elements = node.classList.contains(CLASS_PENDING) ? [node] : [];
        Array.prototype.push.apply(elements, node.querySelectorAll('.' + CLASS_PENDING));

        elements.forEach(function (el) {
          var track = trackOf(el);
          track.pendingSince = state.now();
          if (!state.options.quiet) push('mount', track, { path: track.path });
        });
      });
    });

    classHistory.forEach(function (history, el) {
      // history holds the value *before* each mutation; the live attribute is the value
      // after the last one, so consecutive pairs are the actual transitions.
      var states = history.concat([classAttrOf(el)]);

      for (var i = 0; i < states.length - 1; i += 1) {
        if (states[i] !== states[i + 1]) onClassTransition(el, states[i], states[i + 1]);
      }
    });
  };

  // The MutationObserver only sees changes. An element that is simply never picked up
  // produces no mutations at all, so a poll is the only way to catch it.
  var watchdog = function () {
    var now = state.now();

    // Mid-stream, pending elements are just waiting their turn — SmoothManager processes one
    // batch at a time and holds its lock for the whole fade. Only once the DOM has gone quiet
    // does still-invisible text mean something actually went wrong.
    if (now - state.lastMutationAt < state.options.idleMs) return;

    state.tracked.forEach(function (entry) {
      var el = entry.el;
      var track = entry.track;

      if (!el.isConnected) return;
      if (track.pendingSince === null) return;
      if (now - track.pendingSince < state.options.stuckMs) return;
      if (!el.classList.contains(CLASS_PENDING)) return;

      var opacity = getComputedStyle(el).opacity;
      if (parseFloat(opacity) > 0.99) return;

      anomaly(
        track,
        'stuck-pending',
        'still pending ' + Math.round(now - track.pendingSince) + 'ms after mount and '
          + Math.round(now - state.lastMutationAt) + 'ms after the DOM went quiet, computed opacity=' + opacity
          + ', faded in ' + track.animateCount + ' time(s)'
      );
    });
  };

  var api = {
    start: function (options) {
      if (state) {
        console.warn('[smoothRec] already recording - call __smoothRec.stop() first');
        return api;
      }

      var opts = options || {};
      var startedAt = performance.now();

      state = {
        options: {
          stuckMs: opts.stuckMs != null ? opts.stuckMs : 8000,
          idleMs: opts.idleMs != null ? opts.idleMs : 2000,
          quiet: !!opts.quiet,
          silent: !!opts.silent,
          maxEvents: opts.maxEvents != null ? opts.maxEvents : 50000,
        },
        now: function () { return Math.round(performance.now() - startedAt); },
        lastMutationAt: 0,
        startedAt: new Date().toISOString(),
        nextId: 1,
        tracks: new WeakMap(),
        tracked: [],
        events: [],
        anomalies: [],
        observer: null,
        timer: null,
      };

      // Pick up anything already on screen before the first mutation arrives.
      document.querySelectorAll('.' + CLASS_ROOT + ' .' + CLASS_PENDING).forEach(function (el) {
        trackOf(el).pendingSince = state.now();
      });

      state.observer = new MutationObserver(onMutation);
      state.observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ['class', 'style'],
        characterData: true,
      });
      state.timer = setInterval(watchdog, 250);

      console.log('[smoothRec] recording - reproduce the bug, then call __smoothRec.report()');
      return api;
    },

    /**
     * Drops a labelled marker onto the recording's timeline. Lets the app under test put its
     * own events (a chunk arriving, a request firing) on the same clock as the DOM events, so
     * "did this text appear as soon as it arrived?" becomes a subtraction instead of a guess.
     */
    mark: function (label, data) {
      if (!state) return api;

      state.events.push({ t: state.now(), type: 'mark', label: String(label), data: data });
      return api;
    },

    stop: function () {
      if (!state) return api;
      state.observer.disconnect();
      clearInterval(state.timer);
      console.log('[smoothRec] stopped - ' + state.events.length + ' events, ' + state.anomalies.length + ' anomalies');
      return api;
    },

    report: function () {
      if (!state) {
        console.warn('[smoothRec] not recording');
        return undefined;
      }

      console.log('[smoothRec] ' + state.events.length + ' events, ' + state.tracked.length
        + ' elements, ' + state.anomalies.length + ' anomalies');

      if (!state.anomalies.length) {
        console.log('[smoothRec] no anomalies - the animation ran clean in this session');
        return undefined;
      }

      console.table(state.anomalies);
      return state.anomalies;
    },

    /** The full timeline, ready to be copied with DevTools' copy(). */
    dump: function () {
      if (!state) return null;

      return {
        startedAt: state.startedAt,
        url: location.href,
        userAgent: navigator.userAgent,
        options: state.options,
        elements: state.tracked.map(function (entry) {
          // Whether the node is still in the document decides how to read animateCount: 0.
          // A node that was dropped (markdown re-parses partial syntax such as "![](" into
          // a real image and discards the placeholder) never needed to animate. A node that
          // is still connected, still pending and never animated is the actual bug.
          var connected = entry.el.isConnected;
          var opacity = connected ? parseFloat(getComputedStyle(entry.el).opacity) : null;

          return {
            id: entry.track.id,
            label: entry.track.label,
            path: entry.track.path,
            animateCount: entry.track.animateCount,
            // How many times this node was recycled for different text after it had already
            // faded in — every one of those is a word that appeared without any animation.
            textSwaps: entry.track.textSwaps,
            connected: connected,
            finalOpacity: opacity,
            discarded: !connected && entry.track.animateCount === 0,
            // The one condition that always means a user saw missing text: still on the
            // page, still transparent. Elements that never animated but ended at opacity 1
            // are the `toSkip` parents SmoothManager reveals without a fade of their own.
            stuckAtRest: connected && opacity !== null && opacity < 0.99,
            anomalies: entry.track.anomalies,
          };
        }),
        anomalies: state.anomalies,
        events: state.events,
      };
    },

    /** Downloads the timeline as JSON so it can be attached to a bug report. */
    save: function (fileName) {
      var data = api.dump();
      if (!data) return api;

      var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'smooth-animation-' + Date.now() + '.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      return api;
    },

    /** Outlines every element that is invisible right now, so a stuck node is easy to spot. */
    highlightStuck: function () {
      var found = [];
      document.querySelectorAll('.' + CLASS_ROOT + ' *').forEach(function (el) {
        if (parseFloat(getComputedStyle(el).opacity) > 0.01) return;
        if (!el.textContent.trim()) return;
        el.style.outline = '2px solid red';
        found.push(el);
      });
      console.log('[smoothRec] ' + found.length + ' invisible element(s) outlined in red');
      return found;
    },
  };

  window.__smoothRec = api;
  console.log('[smoothRec] loaded - call __smoothRec.start()');
})();
