;(function () {
    const ua =
      navigator.userAgentData && navigator.userAgentData.platform
        ? navigator.userAgentData.platform
        : navigator.userAgent
  
    document.documentElement.className =
      /mac(intosh| ?OS)?|iOS|iP(hone|od|ad)/i.test(ua) ? 'mac' : 'windows'
  
    document.addEventListener('click', function (event) {
      if (
        !event.defaultPrevented &&
        event.target.getAttribute &&
        event.target.getAttribute('data-action') === 'switch-os'
      ) {
        event.preventDefault()
        document.documentElement.className = event.target.getAttribute('data-os')
      }
    })
  










  (()=>{
    function q() {
        let e;
        try {
            e = window.top.document.referrer
        } catch {
            if (window.parent)
                try {
                    e = window.parent.document.referrer
                } catch {}
        }
        return e === "" && (e = document.referrer),
        e
    }
    function z() {
        try {
            return `${screen.width}x${screen.height}`
        } catch {
            return "unknown"
        }
    }
    function D() {
        let e = 0
          , t = 0;
        try {
            return typeof window.innerWidth == "number" ? (t = window.innerWidth,
            e = window.innerHeight) : document.documentElement != null && document.documentElement.clientWidth != null ? (t = document.documentElement.clientWidth,
            e = document.documentElement.clientHeight) : document.body != null && document.body.clientWidth != null && (t = document.body.clientWidth,
            e = document.body.clientHeight),
            `${t}x${e}`
        } catch {
            return "unknown"
        }
    }
    function B() {
        return navigator.languages ? navigator.languages.join(",") : navigator.language || ""
    }
    function I() {
        return {
            referrer: q(),
            user_agent: navigator.userAgent,
            screen_resolution: z(),
            browser_resolution: D(),
            browser_languages: B(),
            pixel_ratio: window.devicePixelRatio,
            timestamp: Date.now(),
            tz_seconds: new Date().getTimezoneOffset() * -60
        }
    }
    var K = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "scid"];
    function S() {
        let e = {};
        try {
            let t = new URLSearchParams(window.location.search);
            for (let[n,o] of t) {
                let r = n.toLowerCase();
                K.includes(r) && (e[r] = o)
            }
            return e
        } catch {
            return {}
        }
    }
    var w;
    function T() {
        return `${Math.round(Math.random() * (Math.pow(2, 31) - 1))}.${Math.round(Date.now() / 1e3)}`
    }
    function Y(e) {
        let t = `GH1.1.${e}`
          , n = Date.now()
          , o = new Date(n + 1 * 365 * 86400 * 1e3).toUTCString()
          , {domain: r} = document;
        r.endsWith(".github.com") && (r = "github.com"),
        document.cookie = `_octo=${t}; expires=${o}; path=/; domain=${r}; secure; samesite=lax`
    }
    function G() {
        let e, n = document.cookie.match(/_octo=([^;]+)/g);
        if (!n)
            return;
        let o = [0, 0];
        for (let r of n) {
            let[,s] = r.split("=")
              , [,i,...a] = s.split(".")
              , c = i.split("-").map(Number);
            c > o && (o = c,
            e = a.join("."))
        }
        return e
    }
    function E() {
        try {
            let e = G();
            if (e)
                return e;
            let t = T();
            return Y(t),
            t
        } catch {
            return w || (w = T()),
            w
        }
    }
    var x = class {
        constructor(t) {
            this.options = t
        }
        get collectorUrl() {
            return this.options.collectorUrl
        }
        get clientId() {
            return this.options.clientId ? this.options.clientId : E()
        }
        createEvent(t) {
            return {
                page: location.href,
                title: document.title,
                context: {
                    ...this.options.baseContext,
                    ...S(),
                    ...t
                }
            }
        }
        sendPageView(t) {
            let n = this.createEvent(t);
            this.send({
                page_views: [n]
            })
        }
        sendEvent(t, n) {
            let o = {
                ...this.createEvent(n),
                type: t
            };
            this.send({
                events: [o]
            })
        }
        send({page_views: t, events: n}) {
            let o = {
                client_id: this.clientId,
                page_views: t,
                events: n,
                request_context: I()
            }
              , r = JSON.stringify(o);
            try {
                if (navigator.sendBeacon) {
                    navigator.sendBeacon(this.collectorUrl, r);
                    return
                }
            } catch {}
            fetch(this.collectorUrl, {
                method: "POST",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json"
                },
                body: r,
                keepalive: !1
            })
        }
    }
    ;
    function _(e="ha") {
        let t, n = {}, o = document.head.querySelectorAll(`meta[name^="${e}-"]`);
        for (let r of Array.from(o)) {
            let {name: s, content: i} = r
              , a = s.replace(`${e}-`, "").replace(/-/g, "_");
            a === "url" ? t = i : n[a] = i
        }
        if (!t)
            throw new Error(`AnalyticsClient ${e}-url meta tag not found`);
        return {
            collectorUrl: t,
            ...Object.keys(n).length > 0 ? {
                baseContext: n
            } : {}
        }
    }
    var p = "data-analytics-click"
      , M = `a:not([${p}]), button:not([${p}]), [${p}]`;
    function L(e) {
        return {
            ...j(e, "a") && J(e),
            ...j(e, "button") && X(e),
            ...Q(e),
            ...Z(e.getAttribute(p))
        }
    }
    function j(e, t) {
        return e.tagName.toLowerCase() === t
    }
    function J(e) {
        return {
            text: e.innerText || e.getAttribute("aria-label") || "",
            target: e.href
        }
    }
    function X(e) {
        let t = e.closest("form");
        return {
            text: e.innerText || e.getAttribute("aria-label") || "",
            role: e.getAttribute("type") || e.getAttribute("role") || "button",
            ...e.value && {
                value: e.value
            },
            ...t && {
                formAction: t.getAttribute("action") || ""
            }
        }
    }
    function Q(e) {
        let {top: t, left: n} = e.getBoundingClientRect()
          , o = document.body
          , r = document.documentElement
          , s = Math.max(o.scrollHeight, o.offsetHeight, r.clientHeight, r.scrollHeight, r.offsetHeight)
          , i = Math.max(o.scrollWidth, o.offsetWidth, r.clientWidth, r.scrollWidth, r.offsetWidth)
          , a = ((t + window.pageYOffset) / s).toFixed(3)
          , c = ((n + window.pageXOffset) / i).toFixed(3);
        return {
            ref_loc: JSON.stringify({
                top: a,
                left: c
            })
        }
    }
    function Z(e) {
        if (!e)
            return {};
        let[t,n,o] = e.split(",");
        return {
            ...t && {
                category: t.trim()
            },
            ...n && {
                action: n.trim()
            },
            ...ee(o)
        }
    }
    function ee(e) {
        if (!e)
            return {};
        let t = {}
          , n = e.split(";").map(o=>o.trim());
        for (let o of n) {
            let[r,s] = o.split(":");
            r && (t[r.trim()] = s.trim() || r.trim())
        }
        return t
    }
    function f() {
        if (!(this instanceof f))
            return new f;
        this.size = 0,
        this.uid = 0,
        this.selectors = [],
        this.selectorObjects = {},
        this.indexes = Object.create(this.indexes),
        this.activeIndexes = []
    }
    var g = window.document.documentElement
      , te = g.matches || g.webkitMatchesSelector || g.mozMatchesSelector || g.oMatchesSelector || g.msMatchesSelector;
    f.prototype.matchesSelector = function(e, t) {
        return te.call(e, t)
    }
    ;
    f.prototype.querySelectorAll = function(e, t) {
        return t.querySelectorAll(e)
    }
    ;
    f.prototype.indexes = [];
    var ne = /^#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
    f.prototype.indexes.push({
        name: "ID",
        selector: function(t) {
            var n;
            if (n = t.match(ne))
                return n[0].slice(1)
        },
        element: function(t) {
            if (t.id)
                return [t.id]
        }
    });
    var re = /^\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
    f.prototype.indexes.push({
        name: "CLASS",
        selector: function(t) {
            var n;
            if (n = t.match(re))
                return n[0].slice(1)
        },
        element: function(t) {
            var n = t.className;
            if (n) {
                if (typeof n == "string")
                    return n.split(/\s/);
                if (typeof n == "object" && "baseVal"in n)
                    return n.baseVal.split(/\s/)
            }
        }
    });
    var oe = /^((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
    f.prototype.indexes.push({
        name: "TAG",
        selector: function(t) {
            var n;
            if (n = t.match(oe))
                return n[0].toUpperCase()
        },
        element: function(t) {
            return [t.nodeName.toUpperCase()]
        }
    });
    f.prototype.indexes.default = {
        name: "UNIVERSAL",
        selector: function() {
            return !0
        },
        element: function() {
            return [!0]
        }
    };
    var y;
    typeof window.Map == "function" ? y = window.Map : y = function() {
        function e() {
            this.map = {}
        }
        return e.prototype.get = function(t) {
            return this.map[t + " "]
        }
        ,
        e.prototype.set = function(t, n) {
            this.map[t + " "] = n
        }
        ,
        e
    }();
    var O = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g;
    function P(e, t) {
        e = e.slice(0).concat(e.default);
        var n = e.length, o, r, s, i, a = t, c, u, l = [];
        do
            if (O.exec(""),
            (s = O.exec(a)) && (a = s[3],
            s[2] || !a)) {
                for (o = 0; o < n; o++)
                    if (u = e[o],
                    c = u.selector(s[1])) {
                        for (r = l.length,
                        i = !1; r--; )
                            if (l[r].index === u && l[r].key === c) {
                                i = !0;
                                break
                            }
                        i || l.push({
                            index: u,
                            key: c
                        });
                        break
                    }
            }
        while (s);
        return l
    }
    function ie(e, t) {
        var n, o, r;
        for (n = 0,
        o = e.length; n < o; n++)
            if (r = e[n],
            t.isPrototypeOf(r))
                return r
    }
    f.prototype.logDefaultIndexUsed = function() {}
    ;
    f.prototype.add = function(e, t) {
        var n, o, r, s, i, a, c, u, l = this.activeIndexes, d = this.selectors, m = this.selectorObjects;
        if (typeof e == "string") {
            for (n = {
                id: this.uid++,
                selector: e,
                data: t
            },
            m[n.id] = n,
            c = P(this.indexes, e),
            o = 0; o < c.length; o++)
                u = c[o],
                s = u.key,
                r = u.index,
                i = ie(l, r),
                i || (i = Object.create(r),
                i.map = new y,
                l.push(i)),
                r === this.indexes.default && this.logDefaultIndexUsed(n),
                a = i.map.get(s),
                a || (a = [],
                i.map.set(s, a)),
                a.push(n);
            this.size++,
            d.push(e)
        }
    }
    ;
    f.prototype.remove = function(e, t) {
        if (typeof e == "string") {
            var n, o, r, s, i, a, c, u, l = this.activeIndexes, d = this.selectors = [], m = this.selectorObjects, h = {}, v = arguments.length === 1;
            for (n = P(this.indexes, e),
            r = 0; r < n.length; r++)
                for (o = n[r],
                s = l.length; s--; )
                    if (a = l[s],
                    o.index.isPrototypeOf(a)) {
                        if (c = a.map.get(o.key),
                        c)
                            for (i = c.length; i--; )
                                u = c[i],
                                u.selector === e && (v || u.data === t) && (c.splice(i, 1),
                                h[u.id] = !0);
                        break
                    }
            for (r in h)
                delete m[r],
                this.size--;
            for (r in m)
                d.push(m[r].selector)
        }
    }
    ;
    function R(e, t) {
        return e.id - t.id
    }
    f.prototype.queryAll = function(e) {
        if (!this.selectors.length)
            return [];
        var t = {}, n = [], o = this.querySelectorAll(this.selectors.join(", "), e), r, s, i, a, c, u, l, d;
        for (r = 0,
        i = o.length; r < i; r++)
            for (c = o[r],
            u = this.matches(c),
            s = 0,
            a = u.length; s < a; s++)
                d = u[s],
                t[d.id] ? l = t[d.id] : (l = {
                    id: d.id,
                    selector: d.selector,
                    data: d.data,
                    elements: []
                },
                t[d.id] = l,
                n.push(l)),
                l.elements.push(c);
        return n.sort(R)
    }
    ;
    f.prototype.matches = function(e) {
        if (!e)
            return [];
        var t, n, o, r, s, i, a, c, u, l, d, m = this.activeIndexes, h = {}, v = [];
        for (t = 0,
        r = m.length; t < r; t++)
            if (a = m[t],
            c = a.element(e),
            c) {
                for (n = 0,
                s = c.length; n < s; n++)
                    if (u = a.map.get(c[n]))
                        for (o = 0,
                        i = u.length; o < i; o++)
                            l = u[o],
                            d = l.id,
                            !h[d] && this.matchesSelector(e, l.selector) && (h[d] = !0,
                            v.push(l))
            }
        return v.sort(R)
    }
    ;
    var F = {}
      , W = {}
      , b = new WeakMap
      , $ = new WeakMap
      , k = new WeakMap
      , H = Object.getOwnPropertyDescriptor(Event.prototype, "currentTarget");
    function N(e, t, n) {
        var o = e[t];
        return e[t] = function() {
            return n.apply(e, arguments),
            o.apply(e, arguments)
        }
        ,
        e
    }
    function se(e, t, n) {
        var o = []
          , r = t;
        do {
            if (r.nodeType !== 1)
                break;
            var s = e.matches(r);
            if (s.length) {
                var i = {
                    node: r,
                    observers: s
                };
                n ? o.unshift(i) : o.push(i)
            }
        } while (r = r.parentElement);
        return o
    }
    function ae() {
        b.set(this, !0)
    }
    function ce() {
        b.set(this, !0),
        $.set(this, !0)
    }
    function le() {
        return k.get(this) || null
    }
    function U(e, t) {
        !H || Object.defineProperty(e, "currentTarget", {
            configurable: !0,
            enumerable: !0,
            get: t || H.get
        })
    }
    function ue(e) {
        try {
            return e.eventPhase,
            !0
        } catch {
            return !1
        }
    }
    function fe(e) {
        if (!!ue(e)) {
            var t = e.eventPhase === 1 ? W : F
              , n = t[e.type];
            if (!!n) {
                var o = se(n, e.target, e.eventPhase === 1);
                if (!!o.length) {
                    N(e, "stopPropagation", ae),
                    N(e, "stopImmediatePropagation", ce),
                    U(e, le);
                    for (var r = 0, s = o.length; r < s && !b.get(e); r++) {
                        var i = o[r];
                        k.set(e, i.node);
                        for (var a = 0, c = i.observers.length; a < c && !$.get(e); a++)
                            i.observers[a].data.call(i.node, e)
                    }
                    k.delete(e),
                    U(e)
                }
            }
        }
    }
    function C(e, t, n) {
        var o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}
          , r = !!o.capture
          , s = r ? W : F
          , i = s[e];
        i || (i = new f,
        s[e] = i,
        document.addEventListener(e, fe, r)),
        i.add(t, n)
    }
    var de = {
        trackClicks: !1,
        trackPageView: !1
    };
    function A(e) {
        let t = {
            ...de,
            ...e
        };
        window._ha = new x(_()),
        t.trackPageView && window._ha.sendPageView(),
        t.trackClicks ? C("click", M, V) : C("click", `[${p}]`, V)
    }
    function V(e) {
        !e || !e.currentTarget || !window._ha || window._ha.sendEvent("analytics.click", L(e.currentTarget))
    }
    A({
        trackPageView: !0,
        trackClicks: !0
    });
}
)();
